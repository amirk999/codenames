const GameModel = require('../models/game');
const DictionaryModel = require('../models/dictionary');
const CardService = require('./card');
const { Color, GameStatus, CardStatus } = require('../db/constants');


const findAll = (callback) => {
    GameModel.findAll(callback);
}

const findById = (id, callback) => {
    if(typeof(id) != 'number') {
        callback('The ID must be numeric');
        return;
    }
    GameModel.findById(id, (err, game) => {
        if(err) {
            return callback(err);
        }
        if(game && game.length === 1) {
            CardService.findByGame(game[0].id, (err, cards) => {
                if(err) {
                    return callback(err);
                }
                game[0].cards = cards;
                return callback(null, game[0]);
            })
        }
    });
}

const findByName = (name, callback) => {
    GameModel.findByName(name, (err, res) => {
        if(err) {
            return callback(err);
        }
        return callback(null, res[0]);
    });
}

const createGame = (gameDetails, callback) => {
    // TODO: allow custom game sizes
    var gameSize = 25;
    var teamMax = 9;
    var blackIndex = -1;
    var updatedCards = 0;

    // Create the shell game record
    GameModel.createOne(gameDetails, (err, res) => {
        if(err) {
            return callback(err);
        }

        var createdGame = res[0];

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
                    if(cards[currIndex].color === Color.GRAY) {

                        if(createdGame.red_remaining < teamMax && createdGame.blue_remaining < teamMax) {
                            if((currIndex % 2) === 0) {
                                // Make the card red
                                CardService.updateColor(cards[currIndex], Color.RED, (err, res) => updatedCards++);
                                createdGame.red_remaining++;
                            } else {
                                // Make the card blue
                                CardService.updateColor(cards[currIndex], Color.BLUE, (err, res) => updatedCards++);
                                createdGame.blue_remaining++;
                            }
                        } else if(createdGame.red_remaining === teamMax && createdGame.blue_remaining < (teamMax - 1)) {
                            // Red is full. Make the card blue
                            CardService.updateColor(cards[currIndex], Color.BLUE, (err, res) => updatedCards++);
                            createdGame.blue_remaining++;
                        } else if(createdGame.red_remaining < (teamMax - 1) && createdGame.blue_remaining === teamMax) {
                            // Blue is full. Make the card red
                            CardService.updateColor(cards[currIndex], Color.RED, (err, res) => updatedCards++);
                            createdGame.red_remaining++;
                        } else {
                            // Both teams have their cards. Make the last card black
                            CardService.updateColor(cards[currIndex], Color.BLACK, (err, res) => updatedCards++);
                            blackIndex = currIndex;
                        }
                    }
                }

                // Set default starting values
                createdGame.current_turn = createdGame.red_remaining > createdGame.blue_remaining ? Color.RED : Color.BLUE;
                createdGame.status = GameStatus.INPROGRESS;

                GameModel.updateOne(createdGame, (err, updatedGame) => {
                    if(err) {
                        return callback(err);
                    }
                    // Return the full game object (when they are redirected to the actual game page, then the cards will be retrieved)
                    callback(null, updatedGame[0] );
                });
            });
        });
    })
}

const playCard = (data, callback) => {
    GameModel.findById(data.id, (err, res) => {
        // TODO: clean up the model code to return an error if the record is not found
        if(err) {
            return callback(err);
        }
        var game = res[0];

        // Only continue if the game is in progress
        if(game.status !== GameStatus.INPROGRESS) {
            return callback('The game is not in progress');
        }

        CardService.findByGameIndex(data.id, data.index, (err, res) => {
            if(err) {
                return callback(err);
            }
            var card = res[0];

            // Only run the logic if the card is available
            if(card.status !== CardStatus.AVAILABLE) {
                return callback('The card cannot be chosen');
            }

            CardService.updateStatus(card, CardStatus.REVEALED, (err, res) => {
                if(err) {
                    return callback(err);
                }
            })

            if(card.color === Color.BLACK) {
                // Black card: the other team wins
                game.status = (game.current_turn === Color.RED ? GameStatus.BLUEWON : GameStatus.REDWON);
            } else {
                // Update remaining counts based on the selected card
                if(card.color === Color.RED) {
                    game.red_remaining--;
                } else if(card.color === Color.BLUE) {
                    game.blue_remaining--;
                }

                // If a team has zero remaining, then they win
                // If the color picked is different, then change turns
                if(game.red_remaining === 0) {
                    game.status = GameStatus.REDWON;
                } else if(game.blue_remaining === 0) {
                    game.status = GameStatus.BLUEWON;
                } else if(game.current_turn !== card.color) {
                    game.current_turn = (game.current_turn === Color.RED ? Color.BLUE : Color.RED);
                }
            }

            // Save the game and return the results
            GameModel.updateOne(game, (err, updatedGame) => {
                if(err) {
                    return callback(err);
                }
                return callback(null, {data: updatedGame[0]});
            });

        });
        
    });
}

module.exports = { findAll, findById, findByName, createGame, playCard };