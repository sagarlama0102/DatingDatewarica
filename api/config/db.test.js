
import { sequelize, connectDB } from './db';

describe('Database Connection', () => {
  it('should connect to the database successfully', async () => {
    await expect(connectDB()).resolves.not.toThrow();
  });

  it('should authenticate the database connection', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });
});