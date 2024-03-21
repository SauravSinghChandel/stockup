import { MongoClient } from 'mongodb';

const port = 27017;
const url = `mongodb://localhost:${port}`;
const dbName = 'StockUP';

const client = new MongoClient(url);

export async function connectToDatabase() {
    try {
        // Connect to the database
        await client.connect();
        console.log(`Connected to the database on port: ${port}`);
        return client.db(dbName);
    } catch (error) {
        console.error(`Error connecting to the database: ${error}`);
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

export async function insertToCollection(db, documents, collectionName) {
    try {
        const collection = db.collection(collectionName);
        await collection.insertOne(documents);
        console.log("Documents inserted: ", documents);
        return
    } catch (error) {
        console.error("Error inserting documents: ", error);
    }
}

export async function findInCollection(db, query, collectionName) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.find(query).toArray();
        console.log('Results: ', result);
        return result;
    } catch (error) {
        console.error("Error finding documents: ", error);
        return [];
    }
}

export async function deleteInCollection(db, query, collectionName) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne(query);
        console.log("Documents deleted: ", result.deletedCount);
    } catch (error) {
        console.error("Error deleting documents: ", error);
    }
}

export async function updateInCollection(db, query, updateQuery, collectionName) {
    try {
        const collection = db.collection(collectionName);
        const result = await collection.updateOne(query, updateQuery);
        console.log("Document updated: ", result.modifiedCount);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

