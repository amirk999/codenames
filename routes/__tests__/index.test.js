const app = require('../../server');
const supertest = require('supertest');
const request = supertest(app);

it('GET /', async (done) => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Hello from index!' });
    done();
});