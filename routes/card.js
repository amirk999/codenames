const express = require('express');
const CardService = require('../services/card');

var router = express.Router();
router.get('/', function(req, res) {
    res.send('Hello from card!');
});

router.get('/:gameId', function(req, res) {
    const id = parseInt(req.params.gameId);
    CardService.findByGame(id, (err, dbres) => {
        if(err) {
            return res.status(500).send({ error: err });
        }
        if(dbres.length === 0) {
            return res.status(404).send({ error: `Could not find Game with ID ${id}` });
        }
        res.send({ data: dbres });
    });
});

module.exports = router;