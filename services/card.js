const Card = require('../models/card');
const Constants = require('../db/constants');

const createInitialCardList = (gameId, words, callback) => {
    if(!gameId || gameId == 0 || !words || words.length == 0) {
        return callback('Please provide valid data to create the initial list of cards');
    }

    var cardList = [];
    var cardsCreated = 0;

    // Create cards for each word
    words.forEach((item, index, array) => {     
        // Insert the record into the database
            let cardDetails = {
                index: index,
                body: item.word,
                color: Constants.Color.GRAY,
                status: Constants.CardStatus.AVAILABLE,
                game_id: gameId
            };
            Card.query()
                .insert(cardDetails)
                .returning('*')
                .then((card) => {
                    // Add the card details to an array for returning
                    cardList.push(card);
                    cardsCreated++;
                    if(cardsCreated === array.length) {
                        callback(null, cardList);
                    }
                })
                .catch((err) => callback(err));
    });
}

const updateAttributes = (cardDetails, newValues, callback) => {
    // Update the record and return the latest data
    Card.query()
        .patch(newValues)
        .where('id', cardDetails.id)
        .returning('*')
        .then((updatedCard) => callback(null, updatedCard))
        .catch((err) => callback(err));

}

const findByGameIndex = (gameId, index, callback) => {
    Card.query()
        .where('game_id', gameId)
        .where('index', index)
        .then((card) => callback(null, card[0]))
        .catch((err) => callback(err));
        
}

module.exports = { createInitialCardList, updateAttributes, findByGameIndex };