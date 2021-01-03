const CardDB = require('../db/postgres/card');

const findByGameIndex = (gameId, index, callback) => CardDB.findByGameIndex(gameId, index, callback);

const createOne = (cardDetails, callback) => CardDB.createOne(cardDetails, callback);

const updateOne = (cardDetails, callback) => CardDB.updateOne(cardDetails, callback);

module.exports = { findByGameIndex, createOne, updateOne };