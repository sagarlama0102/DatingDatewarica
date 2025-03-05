
const request = require('supertest');
const app = require('./app');

describe('GET /profiles', () => {
  it('responds with json containing a list of profiles', async () => {
    const response = await request(app).get('/profiles');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('POST /swipe', () => {
  it('responds with success message on swipe right', async () => {
    const response = await request(app)
      .post('/swipe')
      .send({ userId: 1, direction: 'right' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Swiped right successfully');
  });

  it('responds with success message on swipe left', async () => {
    const response = await request(app)
      .post('/swipe')
      .send({ userId: 1, direction: 'left' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Swiped left successfully');
  });
});