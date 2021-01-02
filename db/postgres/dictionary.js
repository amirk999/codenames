const client = require('../client');

const findRandom = (numberOfEntries, callback) => {
    client.query('SELECT word FROM dictionary OFFSET floor(random()*(SELECT COUNT(1) FROM dictionary)) LIMIT $1', [numberOfEntries], callback);
}

module.exports = { findRandom };