import request from 'supertest';
import app from '../server';

describe('Auth Controller', () => {
  describe('POST /auth/signup', () => {
    it('should sign up a new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });

    it('should not sign up a user with an existing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    it('should log in an existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should not log in with incorrect credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        });
      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});