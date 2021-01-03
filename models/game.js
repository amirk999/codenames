const GameDB = require('../db/postgres/game');

const findAll = (callback) => GameDB.findAll(callback);

const findById = (id, callback) => GameDB.findById(id, callback);

const findByName = (name, callback) => GameDB.findByName(name, callback);

const createOne = (gameDetails, callback) => {
    if(!gameDetails || !gameDetails.name) {
        return callback('Invalid game data');
    }
    GameDB.createOne(gameDetails, callback);
}

const updateOne = (gameDetails, callback) => GameDB.updateOne(gameDetails, callback);

module.exports = { findAll, findById, findByName, createOne, updateOne };