// database/db.js
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '1234',
    database: 'bonibons',
    port: 5432,
});

const connectToDatabase = async() => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Connection error', err.stack);
    }
};

const disconnectFromDatabase = async() => {
    await client.end();
    console.log('Disconnected from PostgreSQL database');
};

const queryDatabase = async(queryText, params) => {
    try {
        const res = await client.query(queryText, params);
        return res.rows;
    } catch (err) {
        console.error('Query error', err.stack);
        throw err;
    }
};

module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
    queryDatabase,
};