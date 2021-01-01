const GameModel = require('../models/game');

const findAll = (callback) => {
    GameModel.findAll(callback);
}

const findById = (id, callback) => {
    if(typeof(id) != 'number') {
        callback('The ID must be numeric');
        return;
    }
    GameModel.findById(id, callback);
}

const findByName = (name, callback) => {
    GameModel.findByName(name, callback);
}

module.exports = { findAll, findById, findByName };