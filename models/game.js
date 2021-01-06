const Model = require('../db/client');

class Game extends Model {

    // Define the table name
    static get tableName() {
        return 'games';
    }

    // Define the ID column
    static get idColumn() {
        return 'id';
    }

    redRemaining() {
        return this.red_remaining;
    }

    blueRemaining() {
        return this.blue_remaining;
    }

    currentTurn() {
        return this.current_turn;
    }

    // Define the associations from this model
    static get relationMappings() {
        const Card = require('./card');
        return {
            cards: {
                relation: Model.HasManyRelation,
                modelClass: Card,
                join: {
                    from: 'games.id',
                    to: 'cards.game_id'
                }
            }
        };
    }
}

module.exports = Game;