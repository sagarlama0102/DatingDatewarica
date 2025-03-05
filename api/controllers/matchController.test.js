import request from 'supertest';
import app from '../server';

describe('Match Controller', () => {
  describe('GET /matches/user-profiles', () => {
    it('should return a list of user profiles', async () => {
      const response = await request(app).get('/api/matches/user-profiles').set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeInstanceOf(Array);
    });
  });

  describe('POST /matches/swipe-right/:likedUserId', () => {
    it('should swipe right on a user', async () => {
      const response = await request(app).post('/api/matches/swipe-right/1').set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });
  });

  describe('POST /matches/swipe-left/:dislikedUserId', () => {
    it('should swipe left on a user', async () => {
      const response = await request(app).post('/api/matches/swipe-left/1').set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });
  });

  describe('GET /matches', () => {
    it('should return a list of matches', async () => {
      const response = await request(app).get('/api/matches').set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.matches).toBeInstanceOf(Array);
    });
  });
});