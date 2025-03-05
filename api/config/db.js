import dotenv from "dotenv";
import { Sequelize } from "sequelize";

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

console.log("Database Configuration:");
console.log("PG_DATABASE:", process.env.PG_DATABASE);
console.log("PG_USER:", process.env.PG_USER);
console.log("PG_PASSWORD:", process.env.PG_PASSWORD);

// Create Sequelize instance
export const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    dialect: "postgres",
    logging: false,
  }
);

// Function to connect and sync database
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected!");

    // Sync all models (creates tables if not exist)
    await sequelize.sync({ alter: true });
    console.log("Database synced.");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    process.exit(1);
  }
};
