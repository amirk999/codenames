const { test } = require('../../knexfile');
const DictionaryService = require('../dictionary');

it('Retrieve random records', (done) => {
    var recordCount = 25;
    function callback(err, data) {
        if(err) {
            return done(err);
        }
        expect(data.length).toBe(recordCount);
        done();
    }

    DictionaryService.findRandom(recordCount, callback);
});