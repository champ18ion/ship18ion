const express = require('express');
const app = express();

// Hardcoded secret (fake AWS key)
const awsKey = "AKIA1234567890123456";

// Missing env var usage (API_KEY is not in .env)
const apiKey = process.env.API_KEY;

// Debug mode enabled
const config = {
    debug: true
};

// CORS wildcard
app.use(cors({ origin: '*' }));

// Hardcoded DB credentials
const db = "postgres://user:password@production-db.com/db";

app.listen(process.env.PORT || 3000);
