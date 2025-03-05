
import request from 'supertest';
import app from '../server';

describe('Match Routes', () => {
  it('should swipe right on a user', async () => {
    const response = await request(app).post('/api/matches/swipe-right/1').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should swipe left on a user', async () => {
    const response = await request(app).post('/api/matches/swipe-left/1').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return a list of matches', async () => {
    const response = await request(app).get('/api/matches').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.matches).toBeInstanceOf(Array);
  });

  it('should return a list of user profiles', async () => {
    const response = await request(app).get('/api/matches/user-profiles').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.users).toBeInstanceOf(Array);
  });
});