const { Pool } = require('pg');

// TODO: load default values from database.json (dev)
const pool = new Pool({
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "dev.123",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "codenames",
    port: process.env.PGPORT || "5432"
});

const query = (text, params, callback) => {
    return pool.query(text, params, (err, res) => {
        if(err) {
            return callback(err.stack);
        }
        callback(null, res.rows);
    });
};

module.exports = { query };