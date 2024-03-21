import { expect, use } from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import app from '../main.mjs';
import { connectToDatabase, deleteInCollection, disconnectDatabase } from '../src/storage/DatabaseConnection.mjs';

use(chaiHttp);

describe('Authentication API Tests', () => {
    let sessionCookie = '';

    it('should register a new user with valid data', async () => {
        const userData = { "username": 'testuser', "password": 'testpassword' };
        const res = await request(app).post('/register').send(userData);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('Ok').to.equal('Ok');
    });

    it('should return an error for registering with an existing username', async () => {
        const userData = { "username": 'testuser', "password": 'testpassword' };
        const res = await request(app).post('/register').send(userData);
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('Error').to.equal('Username already exists');
        await deleteInCollection(await connectToDatabase(), { "username": "testuser" }, "users");
        await disconnectDatabase();
    });

});
