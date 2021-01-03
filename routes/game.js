const express = require('express');
const GameService = require('../services/game');

var router = express.Router();
router.get('/', function(req, res) {
    res.send('Hello from game!');
});

router.get('/:gameId', function(req, res) {
    const id = parseInt(req.params.gameId);
    GameService.findById(id, (err, dbres) => {
        if(err) {
            return res.status(500).send({ error: err });
        }
        if(dbres.length === 0) {
            return res.status(404).send({ error: `Could not find Game with ID ${id}` });
        }
        res.send({ data: dbres });
    })
});

router.post('/', function(req, res) {
    GameService.createGame(req.body, (err, dbres) => {
        if(err) {
            return res.status(500).send({ error: err });
        }
        res.send({ data: dbres });
    })
});

module.exports = router;