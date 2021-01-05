const CardModel = require('../models/card');
const Constants = require('../db/constants');

const createInitialCardList = (gameId, words, callback) => {
    if(!gameId || gameId == 0 || !words || words.length == 0) {
        return callback('Please provide valid data to create the initial list of cards');
    }

    var cardsCreated = 0;
    var cardList = [];

    words.forEach((item, index, array) => {
        // Must use let to handle the scope in the callback
        let cardDetails = {
            index: index,
            body: item.word,
            color: Constants.Color.GRAY,
            status: Constants.CardStatus.AVAILABLE,
            game_id: gameId
        };
        
        CardModel.createOne(cardDetails, (err, res) => {
            if(err) {
                return callback(err);
            }
            cardsCreated++;
            cardList.push(res[0]);
            if(cardsCreated === array.length) {
                callback(null, cardList);
            }
        })
    });
}

// TODO: move to model once it's been reorganized
const updateColor = (cardDetails, color, callback) => {
    cardDetails.color = color;
    CardModel.updateOne(cardDetails, (err, res) => {
        if(err) {
            return callback(err);
        }
        callback(null, res);
    });
}

const updateStatus = (cardDetails, status, callback) => {
    cardDetails.status = status;
    CardModel.updateOne(cardDetails, (err, res) => {
        if(err) {
            return callback(err);
        }
        callback(null, res);
    })
}

const findByGame = (gameId, callback) => {
    CardModel.findByGame(gameId, callback);
}

const findByGameIndex = (gameId, index, callback) => {
    CardModel.findByGameIndex(gameId, index, callback);
}

module.exports = { createInitialCardList, updateColor, findByGame, findByGameIndex, updateStatus };