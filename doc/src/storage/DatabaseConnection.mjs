import { MongoClient } from 'mongodb';


const port = 27017;
const url = `mongodb://localhost:${port}`;

const client = new MongoClient(url);

export async function connectToDatabase() {

    try {
        // Connect to database
        await client.connect();
        console.log(`Connected to the database on port: ${port}`);
        return client;

    } catch (error) {
        console.log(`Error connecting to the database: ${error}`);
        throw error;
    }

}

export async function disconnectDatabase() {

    try {
        await client.close();
        console.log("Disconnected from the database");
    } catch (error) {
        console.error("Error disconnecting from the database: ", error);
    }
}

export async function insertToCollection(client, documents, dbName, collectionName) {
    const db = client.db(`${dbName}`);

    const collection = db.collection(collectionName);

    collection.insertMany(documents, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log("Documents inserted: ", result.insertedIds);
    })
}

export async function findInCollection(client, query, dbName, collectionName) {
    const db = client.db(`${dbName}`);

    const collection = db.collection(collectionName);

    const result = collection.find(query).toArray((err, documents) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Results: ', documents)
    });

    return result;
}

export async function deleteInCollection(client, query, dbName, collectionName) {
    const db = client.db(`${dbName}`);

    const collection = db.collection(collectionName);

    collection.deleteMany(query, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log("Document deleted: ", result)
    });
}

export async function updateInCollection(client, query , updateQuery, dbName, collectionName) {
    const db = client.db(`${dbName}`);

    const collection = db.collection(collectionName);

    collection.updateOne(query, updateQuery, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log("Document deleted: ", result)
    });
}

