const Dictionary = require('../models/dictionary');
const { raw } = require('objection');

const findRandom = (num, callback) => {
    Dictionary
        .query()
        .select('word')
        .offset(raw('floor(random()*(SELECT COUNT(1) FROM dictionary))'))
        .limit(num)
        .then((words) => {
            callback(null, words);
        })
        .catch((err) => callback(err));
}

module.exports = { findRandom };