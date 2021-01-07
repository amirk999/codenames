const express = require('express');
var cardRouter = require('./card');
var gameRouter = require('./game');

module.exports = function(app) {
    app.use(express.json());
    app.use('/', indexRouter);
    app.use('/api/v1/cards', cardRouter);
    app.use('/api/v1/games', gameRouter);
}

var indexRouter = express.Router();
indexRouter.get('/', function(req, res) {
    res.send('Hello from index!');
});