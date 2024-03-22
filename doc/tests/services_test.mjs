import { expect, use } from 'chai';
import request from 'supertest';
import chaiHttp from 'chai-http';
import app from '../main.mjs';
import { connectToDatabase, disconnectDatabase } from '../src/storage/DatabaseConnection.mjs';

use(chaiHttp);

describe('API Tests', () => {
    before(async () => {
        // Connect to the database before running the tests
        await connectToDatabase();
    });

    after(async () => {
        // Disconnect from the database after running the tests
        await disconnectDatabase();
    });

    it('should return aggregated data for valid parameters', async () => {
        const ticker = 'AAPL'; // Example ticker symbol
        const multiplier = 1; // Example multiplier
        const timespan = 'day'; // Example timespan
        const from = '2023-01-09'; // Example from date
        const to = '2023-01-10'; // Example to date

        const res = await request(app)
            .get(`/aggregate?ticker=${ticker}&multiplier=${multiplier}&timespan=${timespan}&from=${from}&to=${to}`)
            .expect(200);

        expect(res.status).to.equal(200)
        expect(res.body).to.be.an('object'); // Expecting a JSON object
        expect(res.body).to.have.property('ticker').to.equal('AAPL'); 
        expect(res.body).to.have.property('queryCount').to.equal(2); 
        expect(res.body).to.have.property('status').to.equal('OK');
        expect(res.body).to.have.property('count').to.equal(2);
        expect(res.body).to.have.property('results').to.be.an('array').with.lengthOf(2);
    });

    it('should get daily snapshot data', async () => {
        const date = '2023-09-01';

        const req = await request(app).get(`/dailySnapshot?date=${date}`);
        const res = req.body;
        expect(req.status).to.equal(200);
        expect(res).to.have.property('queryCount').to.equal(10470);
        expect(res).to.have.property('resultsCount').to.equal(10470);
        expect(res).to.have.property('adjusted').to.be.true;
    });

});
