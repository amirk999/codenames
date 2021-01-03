const client = require('../client');

const findByGameIndex = (gameId, index, callback) => {
    client.query('SELECT * FROM cards WHERE game_id = $1 AND index = $2', [gameId, index], callback);
}

const findByGame = (gameId,callback) => {
    client.query('SELECT * FROM cards WHERE game_id = $1  ORDER BY index', [gameId], callback);
}

const createOne = (cardDetails, callback) => {
    client.query('INSERT INTO cards(index, body, color, status, game_id) VALUES($1, $2, $3, $4, $5) RETURNING *', [cardDetails.index, cardDetails.body, cardDetails.color, cardDetails.status, cardDetails.game_id], callback);
}

const updateOne = (cardDetails, callback) => {
    client.query('UPDATE cards SET color = $1, status = $2 WHERE id = $3 RETURNING *', [cardDetails.color, cardDetails.status, cardDetails.id], callback);
}

module.exports = { findByGameIndex, createOne, updateOne, findByGame };