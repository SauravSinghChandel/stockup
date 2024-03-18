import express from 'express';
import { aggregate, getDailySnapshot } from './src/services/APIService.mjs';
import { connectToDatabase, disconnectDatabase } from './src/storage/DatabaseConnection.mjs';

const app = express();
const port = 8820;

const client = connectToDatabase("main");

app.get('/', (req , res) => {
    const data = null;
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/aggregate', async (req, res) => {
    const data = await aggregate();
    console.log(data);
}) 

app.get('/dailySnapshot', async (req, res) => {
    const data = await getDailySnapshot("2023-09-01");
    console.log("\n\nFrom main:", data);
})

app.on('close', async () => {
    disconnectDatabase(client);
    console.log("Connection to MongoDB closed")
})
