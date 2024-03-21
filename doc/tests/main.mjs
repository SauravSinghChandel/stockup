import { expect, use } from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import app from '../main.mjs';
import { connectToDatabase, deleteInCollection, disconnectDatabase } from '../src/storage/DatabaseConnection.mjs';

use(chaiHttp);

describe('Register API Tests', () => {

    it('should register a new user with valid data', async () => {
        const userData = { "username": 'testuser', "password": 'testpassword' };
        const res = await request(app).post('/register').send(userData);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('Ok').to.equal('Ok');
    });

    it('should return an error for registering with an existing username', async () => {
        const userData = { "username": 'testuser', "password": 'testpassword' };
        const res = await request(app).post('/register').send(userData);
        await request(app).post('/register').send(userData);
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('Error').to.equal('Username already exists');
        await deleteInCollection(await connectToDatabase(), { "username": "testuser" }, "users");
        await disconnectDatabase();
    });

});

describe('Login API Tests', () => {
    let client;

    before(async () => {
        client = await connectToDatabase();
        // Create a test user
        await request(app)
            .post('/register')
            .send({ "username": 'testuser', "password": 'testpassword' });

        await request(app)
            .get('/logout')
    });

    after(async () => {
        await deleteInCollection(client, { "username": "testuser" }, "users");
        await disconnectDatabase(client);
    });

    it('should login with valid credentials and return 200', async () => {
        const res = await request(app)
            .post('/login')
            .send({ "username": 'testuser', "password": 'testpassword' })
        
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').equal('Login successful');
    });

    it('should not login with invalid credentials and return 401', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: 'invaliduser', password: 'invalidpassword' })

        expect(res.status).to.equal(401)
        expect(res.body).to.have.property('message').equal('Unauthorized');
            });
    });
