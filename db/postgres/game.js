const client = require('../client');

// TODO: move all execution code to its own method to reduce duplicate code

const findAll = (callback) => {
    client.query('SELECT * FROM games', '', (err, res) => {
        if(err) {
            return callback(err.stack);
        }
        callback(null, res.rows);
    });
}

const findById = (id, callback) => {
    client.query('SELECT * FROM games WHERE id = $1', [id], (err, res) => {
        if(err) {
            return callback(err.stack);
        }
        callback(null, res.rows);
    });
}

const findByName = (name, callback) => {
    client.query('SELECT * FROM games WHERE name = $1', [name], (err, res) => {
        if(err) {
            return callback(err.stack);
        }
        callback(null, res.rows);
    });
}

module.exports = { findAll, findById, findByName };