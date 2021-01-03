const GameModel = require('../models/game');
const DictionaryModel = require('../models/dictionary');
const CardService = require('./card');
const Constants = require('../db/constants');


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

const createGame = (gameDetails, callback) => {
    // TODO: allow custom game sizes
    var gameSize = 25;
    var teamMax = 9;
    var blackIndex = -1;
    var updatedCards = 0;

    // Create the shell game record
    GameModel.createOne(gameDetails, (err, newGame) => {
        if(err) {
            return callback(err);
        }

        var createdGame = newGame[0];

        // Get a random list of words
        DictionaryModel.findRandom(gameSize, (err, words) => {
            if(err) {
                return callback(err);
            }
            CardService.createInitialCardList(createdGame.id, words, (err, cards) => {
                if(err) {
                    return callback(err);
                }

                // Randomize the card colors
                while(blackIndex < 0) {
                    // Get a random number between 0 and (gameSize - 1)
                    let currIndex = Math.floor(Math.random() * gameSize);

                    // Only update gray cards
                    if(cards[currIndex].color === Constants.Color.GRAY) {

                        if(createdGame.red_remaining < teamMax && createdGame.blue_remaining < teamMax) {
                            if((currIndex % 2) === 0) {
                                // Make the card red
                                CardService.updateColor(cards[currIndex], Constants.Color.RED, (err, res) => updatedCards++);
                                createdGame.red_remaining++;
                            } else {
                                // Make the card blue
                                CardService.updateColor(cards[currIndex], Constants.Color.BLUE, (err, res) => updatedCards++);
                                createdGame.blue_remaining++;
                            }
                        } else if(createdGame.red_remaining === teamMax && createdGame.blue_remaining < (teamMax - 1)) {
                            // Red is full. Make the card blue
                            CardService.updateColor(cards[currIndex], Constants.Color.BLUE, (err, res) => updatedCards++);
                            createdGame.blue_remaining++;
                        } else if(createdGame.red_remaining < (teamMax - 1) && createdGame.blue_remaining === teamMax) {
                            // Blue is full. Make the card red
                            CardService.updateColor(cards[currIndex], Constants.Color.RED, (err, res) => updatedCards++);
                            createdGame.red_remaining++;
                        } else {
                            // Both teams have their cards. Make the last card black
                            CardService.updateColor(cards[currIndex], Constants.Color.BLACK, (err, res) => updatedCards++);
                            blackIndex = currIndex;
                        }
                    }
                }

                // Set default starting values
                createdGame.current_turn = createdGame.red_remaining > createdGame.blue_remaining ? Constants.Color.RED : Constants.Color.BLUE;
                createdGame.status = Constants.GameStatus.INPROGRESS;

                GameModel.updateOne(createdGame, (err, updatedGame) => {
                    if(err) {
                        return callback(err);
                    }
                    updatedGame[0].cards = cards;
                    callback(null, { data: updatedGame });
                });
            });
        });
    })
}

module.exports = { findAll, findById, findByName, createGame };