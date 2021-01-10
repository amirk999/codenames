const GameService = require('../game');

const gameDetails = {
    name: 'Test Record'
};

// TODO: Seed data before tests in order to test card play actions
describe('Game creation tests', () => {
    it('should create a game record', (done) => {
        function callback(err, data) {
            if(err) {
                return done(err);
            }
            expect(data.name).toBe(gameDetails.name);
            expect(data.id).toBe(1);
            done();
        }
        GameService.createGame(gameDetails, callback);
    });
});

describe('Game lookup tests', () => {
    it('should find the game by ID', (done) => {
        function callback(err, data) {
            if(err) {
                return done(err);
            }
            expect(data.name).toBe(gameDetails.name);
            done();
        }
        GameService.findById(1, callback);
    });

    it('should find the game by name', (done) => {
        function callback(err, data) {
            if(err) {
                return done(err);
            }
            expect(data.name).toBe(gameDetails.name);
            done();
        }
        GameService.findByName(gameDetails.name, callback);
    });
});