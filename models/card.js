const Model = require('../db/client');

class Card extends Model {
    
    // Define the table name
    static get tableName() {
        return 'cards';
    }

    // Define the ID column
    static get idColumn() {
        return 'id';
    }


    // Define the associations from this model
    static get relationMappings() {
        const Game = require('./game');
        
        return {
            game: {
                relation: Model.BelongsToOneRelation,
                modelClass: Game,
                join: {
                    from: 'cards.game_id',
                    to: 'games.id'
                }
            }
        };
    }
}

module.exports = Card;