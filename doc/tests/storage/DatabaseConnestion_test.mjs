import { expect } from 'chai';
import { connectToDatabase, disconnectDatabase, insertToCollection, findInCollection, deleteInCollection, updateInCollection } from '../storage/../../src/storage/DatabaseConnection.mjs';

describe('MongoDB Functions', () => {
    let client;

    before(async () => {
        client = await connectToDatabase();
    });

    after(async () => {
        await disconnectDatabase();
    });

    describe('Insertion and Finding', () => {
        const documents = [
            { name: 'John Doe', age: 35 },
            { name: 'Jane Doe', age: 28 },
        ];
        const dbName = 'testdb';
        const collectionName = 'testcollection';

        it('should insert documents into the collection', async () => {
            await insertToCollection(client, documents, dbName, collectionName);
        });

        it('should find documents in the collection', async () => {
            const query = { age: { $gt: 30 } };
            const result = await findInCollection(client, query, dbName, collectionName);

            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf.above(0);
            console.log('Found documents:', result);
        });
    });

    describe('Deletion and Update', () => {
        const dbName = 'testdb';
        const collectionName = 'testcollection';

        it('should delete documents from the collection', async () => {
            const query = { age: { $lt: 30 } };
            await deleteInCollection(client, query, dbName, collectionName);
        });

        it('should update documents in the collection', async () => {
            const query = { name: 'John Doe' };
            const updateQuery = { $set: { age: 40 } };
            await updateInCollection(client, query, updateQuery, dbName, collectionName);
        });
    });
});

