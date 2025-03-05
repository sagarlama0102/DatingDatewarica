import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcryptjs";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // This ensures the id is generated as a UUID
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genderPreference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: { type: DataTypes.STRING, defaultValue: "" },
    image: { type: DataTypes.STRING, defaultValue: "" },
  },
  { timestamps: true }
);

//add a user.match function
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Associations
// Associations - these need to be properly defined
User.belongsToMany(User, { 
  as: "likedUsers", 
  through: "Likes", 
  foreignKey: "likerId",
  otherKey: "likedId" 
});

User.belongsToMany(User, { 
  as: "likedByUsers", 
  through: "Likes", 
  foreignKey: "likedId",
  otherKey: "likerId" 
});

User.belongsToMany(User, { 
  as: "dislikedUsers", 
  through: "Dislikes", 
  foreignKey: "dislikerId",
  otherKey: "dislikedId" 
});

User.belongsToMany(User, { 
  as: "matchedUsers", 
  through: "Matches", 
  foreignKey: "userId",
  otherKey: "matchedId" 
});

export default User;
