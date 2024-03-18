import { restClient } from '@polygon.io/client-js';
const rest = restClient('VfpYvKnxUNmXJdlpykHKQcr8QM3G7nDF');

export async function aggregate(ticker, multiplier, timespan, from, to) {
    try{
        const data = await rest.stocks.aggregates(ticker, multiplier, timespan, from, to);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getDailySnapshot(date) {
    try {
        const data = await rest.stocks.aggregatesGroupedDaily(date);
        return data
    } catch (error) {
        console.error(error);
    }
}
