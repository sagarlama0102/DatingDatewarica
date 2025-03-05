import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";
import Sequelize from "sequelize";


export const sendMessage = async (req, res) => {
	try {
		const { content, receiverId } = req.body;

		// Ensure user authentication
		if (!req.user || !req.user.id) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized: User not found",
			});
		}

		// Validate request data
		if (!content || !receiverId) {
			return res.status(400).json({
				success: false,
				message: "Message content and receiver ID are required",
			});
		}

		// Save message to database
		const newMessage = await Message.create({
			senderId: req.user.id, // Ensure senderId is explicitly set
			receiverId: receiverId, // Ensure receiverId is provided
			content,
		});

		// WebSocket notification
		const io = getIO();
		const connectedUsers = getConnectedUsers();
		const receiverSocketId = connectedUsers.get(receiverId);

		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", { message: newMessage });
		}

		// Respond with success
		res.status(201).json({
			success: true,
			message: newMessage,
		});
	} catch (error) {
		console.error("Error in sendMessage:", error);

		// Check if it's a validation error
		if (error.name === "SequelizeValidationError") {
			return res.status(400).json({
				success: false,
				message: error.errors.map((err) => err.message).join(", "),
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};


export const getConversation = async (req, res) => {
	const { userId } = req.params;
	try {
		const messages = await Message.findAll({
			where: {
				[Sequelize.Op.or]: [
					{ senderId: req.user.id, receiverId: userId },
					{ senderId: userId, receiverId: req.user.id },
				],
			},
			order: [['createdAt', 'ASC']],
		});

		res.status(200).json({
			success: true,
			messages,
		});
	} catch (error) {
		console.log("Error in getConversation: ", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
