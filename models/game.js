const GameDB = require('../db/postgres/game');

const findAll = (callback) => {
    GameDB.findAll(callback);
}

const findById = (id, callback) => {
    GameDB.findById(id, callback);
}

const findByName = (name, callback) => {
    GameDB.findByName(name, callback);
}

module.exports = { findAll, findById, findByName };