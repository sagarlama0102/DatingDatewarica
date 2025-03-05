import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import {User} from "./User.js"; // Import User model for associations
// models/Message.js


// models/Message.js


const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,  // Reference the User model
      key: 'id',  // Reference the id column of the User model
    },
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Default export for the Message model
export default Message;
