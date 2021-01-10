const Game = require('../models/game');
const DictionaryService = require('./dictionary');
const CardService = require('./card');
const { Color, GameStatus, CardStatus } = require('../db/constants');

const findById = (id, callback) => {
    Game.query().findById(id)
        .then((game) => callback(null, game))
        .catch((err) => callback(err));
}

const findByName = (name, callback) => {
    Game.query().findOne({ name })
        .then((game) => callback(null, game))
        .catch((err) => callback(err));
}

const findCards = (gameId, callback) => {
    Game.relatedQuery('cards')
        .for(gameId)
        .where('status', CardStatus.REVEALED)
        .then((cards) => callback(null, cards))
        .catch((err) => callback(err));
}

const createGame = (gameDetails, callback) => {
    // TODO: allow custom game sizes
    const gameSize = 25;
    const teamMax = 9;
    var blackIndex = -1;

    findByName(gameDetails.name, (err, data) => {
        if(err) {
            return callback(err);
        } else if(data) {
            return callback('A game with the same name already exists');
        }

        Game.query()
            .insert(gameDetails)
            .returning('*')
            .then((createdGame) => {
                DictionaryService.findRandom(gameSize, (err, words) => {
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
            
                                if(createdGame.redRemaining() < teamMax && createdGame.blueRemaining() < teamMax) {
                                    if((currIndex % 2) === 0) {
                                        // Make the card red
                                        CardService.updateAttributes(cards[currIndex], { color: Color.RED }, (err, res) => { });
                                        createdGame.red_remaining++;
                                    } else {
                                        // Make the card blue
                                        CardService.updateAttributes(cards[currIndex], { color: Color.BLUE }, (err, res) => { });
                                        createdGame.blue_remaining++;
                                    }
                                } else if(createdGame.redRemaining() === teamMax && createdGame.blueRemaining() < (teamMax - 1)) {
                                    // Red is full. Make the card blue
                                    CardService.updateAttributes(cards[currIndex], { color: Color.BLUE }, (err, res) => { });
                                    createdGame.blue_remaining++;
                                } else if(createdGame.redRemaining() < (teamMax - 1) && createdGame.blueRemaining() === teamMax) {
                                    // Blue is full. Make the card red
                                    CardService.updateAttributes(cards[currIndex], { color: Color.RED }, (err, res) => { });
                                    createdGame.red_remaining++;
                                } else {
                                    // Both teams have their cards. Make the last card black
                                    CardService.updateAttributes(cards[currIndex], { color: Color.BLACK }, (err, res) => { });
                                    blackIndex = currIndex;
                                }
                            }
                        }
            
                        // Set default starting values based on the card colors
                        createdGame.current_turn = createdGame.redRemaining() > createdGame.blueRemaining() ? Color.RED : Color.BLUE;
                        createdGame.status = GameStatus.INPROGRESS;
            
                        Game.query()
                            .findById(createdGame.id)
                            .patch(createdGame)
                            .returning('*')
                            .then((game) => callback(null, game))
                            .catch((err) => callback(err));
                    });
                });
            })
            .catch((err) => callback(err));
    });

}

const playCard = (data, callback) => {
    Game.query().findById(data.id)
        .then((game) => {
            // Only continue if the game is in progress
            if(game.status !== GameStatus.INPROGRESS) {
                return callback('The game is not in progress');
            }

            CardService.findByGameIndex(data.id, data.index, (err, card) => {
                if(err) {
                    return callback(err);
                }

                // Only run the logic if the card is available
                if(card.status !== CardStatus.AVAILABLE) {
                    return callback('The card cannot be chosen');
                }

                CardService.updateAttributes(card, { status: CardStatus.REVEALED }, (err, res) => {
                    if(err) {
                        return callback(err);
                    }

                    if(card.color === Color.BLACK) {
                        // Black card: the other team wins
                        game.status = (game.currentTurn() === Color.RED ? GameStatus.BLUEWON : GameStatus.REDWON);
                    } else {
                        // Update remaining counts based on the selected card
                        if(card.color === Color.RED) {
                            game.red_remaining--;
                        } else if(card.color === Color.BLUE) {
                            game.blue_remaining--;
                        }
        
                        // If a team has zero remaining, then they win
                        // If the color picked is different, then change turns
                        if(game.redRemaining() === 0) {
                            game.status = GameStatus.REDWON;
                        } else if(game.blueRemaining() === 0) {
                            game.status = GameStatus.BLUEWON;
                        } else if(game.currentTurn() !== card.color) {
                            game.current_turn = (game.currentTurn() === Color.RED ? Color.BLUE : Color.RED);
                        }
                    }

                    // Save the game and return the results
                    Game.query()
                        .findById(game.id)
                        .patch(game)
                        .returning('*')
                        .then((game) => callback(null, game))
                        .catch((err) => callback(err));
                });
            });

        })
        .catch((err) => callback(err));
}

module.exports = { findById, findByName, createGame, playCard, findCards };