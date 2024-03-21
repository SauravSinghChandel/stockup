import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser'
import { aggregate, getDailySnapshot } from './src/services/APIService.mjs';
import { connectToDatabase, disconnectDatabase } from './src/storage/DatabaseConnection.mjs';
import { registerUser, verifyLogin } from './src/auth/authentication.mjs';

const app = express();
const port = 8820;

const client = await connectToDatabase();

app.use(session({
    secret: "this_is_secret_dont_look_at_it",
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    const data = null;
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/aggregate', async (req, res) => {
    
    const ticker = req.query.ticker;
    const multiplier = req.query.multiplier;
    const timespan = req.query.timespan;
    const from = req.query.from;
    const to = req.query.to;

    try {
        const data = await aggregate(ticker, multiplier, timespan, from, to);
        console.log(data);
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        
        return res.status(401).json({'message': "Not found"})
    }


})

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("username", username)

    try {
        const validLogin = await verifyLogin(client, username, password)
        console.log("####################", validLogin)

        if (validLogin) {
            req.session.username = username;
            return res.status(200).json({"message": "Login successful"});

        } else {
            return res.status(401).json({'message': "Unauthorized"})
        }
    } catch (err) {
        console.error(err)
        res.status(401)
    }
})

app.get('/logout', (req, res) => {
    // Destroy session
    req.session.destroy();

    console.log("Logged out successfully")
    res.send('Logged out successfully');
});

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {

        const register = await registerUser(client, res, username, password)

        if (register) {

            req.sessionID = username;

            return res.status(200).json({ "Ok": "Ok" })
        } else {
            return res.status(401).json({"Error": "Username already exists"})
        }


    } catch (err) {
        console.error("Error found: ", err)

        return res.status(401).json({ "Error": err })
    }

})

app.get('/dailySnapshot', async (req, res) => {
    const data = await getDailySnapshot(req.query.date);

    return res.status(200).send(data)
})

app.on('close', async () => {
    disconnectDatabase(client);
    console.log("Connection to MongoDB closed")
})

export default app;
