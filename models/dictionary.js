const DictionaryDB = require('../db/postgres/dictionary');

const findRandom = (numberOfEntries, callback) => {
    DictionaryDB.findRandom(numberOfEntries, callback);
}

module.exports = { findRandom };