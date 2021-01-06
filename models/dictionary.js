const Model = require('../db/client');

class Dictionary extends Model {

    // Define the table name
    static get tableName() {
        return 'dictionary';
    }

    // Define the ID column
    static get idColumn() {
        return 'id';
    }
}

module.exports = Dictionary;