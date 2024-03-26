import { expect, use } from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import app from '../main.mjs';
import { activeGames } from '../main.mjs';
import { connectToDatabase, deleteInCollection, disconnectDatabase } from '../src/storage/DatabaseConnection.mjs';

use(chaiHttp);

describe('Register API Tests', () => {
    let client;

    before(async () => {
        client = await connectToDatabase();
    });

    after(async () => {
        await deleteInCollection(client, { "username": "testuser" }, "users");
        await disconnectDatabase(client);
    });


    it('should register a new user with valid data', async () => {
        const userData = { "username": 'testuser', "password": 'testpassword' };
        const res = await request(app).post('/register').send(userData);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('Ok').to.equal('Ok');
    });

    it('should return an error for registering with an existing username', async () => {
        const userData = { "username": 'testuser', "password": 'testpassword' };
        await request(app).post('/register').send(userData);
        const res = await request(app).post('/register').send(userData);
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('Error').to.equal('Username already exists');
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

describe('Game API Test', () => {
    let client, gameID, testUserSession;

    before(async function() {
        client = await connectToDatabase();

        // Create a test user
        const registerRes = await request(app)
            .post('/register')
            .send({ "username": 'testuser', "password": 'testpassword' });

        if (registerRes.statusCode !== 200) {
            throw new Error('User registration failed');
        }

        // Log in the test user
        const loginRes = await request(app)
            .post('/login')
            .send({ "username": 'testuser', "password": 'testpassword' });

        if (loginRes.statusCode !== 200) {
            throw new Error('User login failed');
        }
        // Store the session information
        testUserSession = loginRes.header['set-cookie'];

        const adminRes = request(app)
            .post('/admin?makeAdmin=true')
            .set('Cookie', testUserSession)
            .end((err, res) => {
                if (err) return done(err)
            })

        console.log("444444444444444444444444444444444", adminRes)
        testUserSession = adminRes.header['Cookie'];

    });

    after(async () => {
        await deleteInCollection(client, { "username": "testuser" }, "users");
        await disconnectDatabase(client);
    });

    it('should create a new game', async () => {
        const gameData = {
            name: 'Test Game',
            maxPlayers: 4,
            duration: 60,
            minAmount: 10,
            goalAmount: 100
        };


        const res = await request(app)
            .post('/createGame')
            .set('Cookie', testUserSession)
            .send(gameData)
            .expect(200);



        expect(res.body).to.have.property('message').to.equal('Game created successfully');
        expect(res.body).to.have.property('gameID');
        gameID = res.body.gameID; // Store the gameId for later tests
    });

    it('should join an existing game', async () => {

        const res = await request(app)
            .post(`/joinGame?gameID=${gameID}`) // Use the gameId from the first test
            .set('Cookie', testUserSession)
            .expect(200);

        expect(res.body).to.have.property('message').to.equal(`Player ${testUserSession.username} has joined Game ${gameID}`);
    });

    it('should end an existing game', async () => {
        console.log(gameID)
        const res = await request(app)
            .post(`/endGame?gameID=${gameID}`) // Use the gameId from the previous test
            .set('Cookie', testUserSession)
            .expect(200);

        expect(res.body).to.have.property('message').to.equal(`Game (${gameID}) removed successfully`);
    });

})
