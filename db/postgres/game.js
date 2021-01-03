const client = require('../client');

const findAll = (callback) => {
    client.query('SELECT * FROM games', '', callback);
}

const findById = (id, callback) => {
    client.query('SELECT * FROM games WHERE id = $1', [id], callback);
}

const findByName = (name, callback) => {
    client.query('SELECT * FROM games WHERE name = $1', [name], callback);
}

const createOne = (gameDetails, callback) => {
    client.query('INSERT INTO games(name, red_remaining, blue_remaining) VALUES($1, 0, 0) RETURNING *', [gameDetails.name], callback);
}

const updateOne = (gameDetails, callback) => {
    client.query('UPDATE games SET name = $1, status = $2, red_remaining = $3, blue_remaining = $4, current_turn = $5 WHERE id = $6 RETURNING *', [gameDetails.name, gameDetails.status, gameDetails.red_remaining, gameDetails.blue_remaining, gameDetails.current_turn, gameDetails.id], callback);
}

module.exports = { findAll, findById, findByName, createOne, updateOne };