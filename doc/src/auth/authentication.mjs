import { insertToCollection, findInCollection } from '../storage/DatabaseConnection.mjs'
import bcrypt from 'bcrypt';

export async function registerUser(db, res, uname, password) {

    // Checking if the username is unique
    try {
        const result = await findInCollection(db, { "username": uname }, 'users');

        console.log(result.length)
        if (result.length > 0) {

            return false;
        } else {

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const doc = {
                    "username": uname,
                    "password": hashedPassword,
                }

                await insertToCollection(db, doc, 'users');

                console.log("Inserted sucessfully!")

                return true

            } catch (err) {
                return res.status(500).json({ error: `Internal server error: ${err}` });
            }
        }
    } catch (err) {
        console.error(err);
    }

    return res.status(200).json({ "Ok": "Ok" })
}

export async function verifyLogin(db, uname, password) {
    try {

        const result = await findInCollection(db, { "username": uname }, 'users');
        console.log("kasdfjghlasdiufhadsolifhdaslfijkahsdflkjasdflkasf", result[0])

        if (result.length < 0) {
            
            return false;

        } else {

            try {
                const passwordMatch = bcrypt.compare(password, result[0].password)

                return passwordMatch

            } catch (err) {
                console.error(err);
                return false
                //return res.status(500).json({ error: `Internal server error: ${err}` });
            }
        }
    } catch (err) {
        console.error(err);
        return false
    }

}
