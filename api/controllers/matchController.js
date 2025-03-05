import { User } from "../models/User.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";
import { Op } from "sequelize";

export const swipeRight = async (req, res) => {
	try {
		const { likedUserId } = req.params;
		const currentUser = await User.findByPk(req.user.id);
		const likedUser = await User.findByPk(likedUserId);

		if (!likedUser) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const currentUserLikes = await currentUser.getLikedUsers();
		const likedUserLikes = await likedUser.getLikedUsers();

		if (!currentUserLikes.some(user => user.id === likedUserId)) {
			await currentUser.addLikedUser(likedUser);

			// if the other user already liked us, it's a match, so let's update both users
			if (likedUserLikes.some(user => user.id === currentUser.id)) {
				await currentUser.addMatchedUser(likedUser);
				await likedUser.addMatchedUser(currentUser);

				// send notification in real-time with socket.io
				const connectedUsers = getConnectedUsers();
				const io = getIO();

				const likedUserSocketId = connectedUsers.get(likedUserId);

				if (likedUserSocketId) {
					io.to(likedUserSocketId).emit("newMatch", {
						id: currentUser.id,
						name: currentUser.name,
						image: currentUser.image,
					});
				}

				const currentSocketId = connectedUsers.get(currentUser.id.toString());
				if (currentSocketId) {
					io.to(currentSocketId).emit("newMatch", {
						id: likedUser.id,
						name: likedUser.name,
						image: likedUser.image,
					});
				}
			}
		}

		res.status(200).json({
			success: true,
			user: currentUser,
		});
	} catch (error) {
		console.log("Error in swipeRight: ", error);

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const swipeLeft = async (req, res) => {
	try {
		const { dislikedUserId } = req.params;
		const currentUser = await User.findByPk(req.user.id);

		const currentUserDislikes = await currentUser.getDislikedUsers();

		if (!currentUserDislikes.some(user => user.id === dislikedUserId)) {
			const dislikedUser = await User.findByPk(dislikedUserId);
			await currentUser.addDislikedUser(dislikedUser);
		}

		res.status(200).json({
			success: true,
			user: currentUser,
		});
	} catch (error) {
		console.log("Error in swipeLeft: ", error);

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const getMatches = async (req, res) => {
	try {
	  // Make sure to use the exact same alias names as defined in your model
	  const currentUser = await User.findByPk(req.user.id, {
		include: [
		  { 
			model: User, 
			as: 'likedUsers',  // Use EXACTLY the same alias as defined in your model
			attributes: ['id'] 
		  },
		  { 
			model: User, 
			as: 'likedByUsers',  // Use EXACTLY the same alias as defined in your model 
			attributes: ['id']
		  }
		]
	  });
  
	  if (!currentUser) {
		return res.status(404).json({
		  success: false,
		  message: "User not found",
		});
	  }
  
	  // Get IDs of users current user has liked
	  const likedIds = currentUser.likedUsers?.map(user => user.id) || [];
	  // Get IDs of users who have liked the current user
	  const likedByIds = currentUser.likedByUsers?.map(user => user.id) || [];
	  
	  // Find mutual likes (matches)
	  const matchIds = likedIds.filter(id => likedByIds.includes(id));
	  
	  // Get full user details for matches
	  const matches = await User.findAll({
		where: {
		  id: {
			[Op.in]: matchIds.length > 0 ? matchIds : [null]
		  }
		},
		attributes: ['id', 'name', 'age', 'gender', 'bio', 'image']
	  });
  
	  res.status(200).json({
		success: true,
		matches,
	  });
	} catch (error) {
	  console.log("Error in getMatches: ", error);
	  res.status(500).json({
		success: false,
		message: "Internal server error",
	  });
	}
  };

export const getUserProfiles = async (req, res) => {
	try {
	  // Get user with associations
	  const currentUser = await User.findByPk(req.user.id, {
		include: [
		  { model: User, as: 'likedUsers' },
		  { model: User, as: 'dislikedUsers' },
		  { model: User, as: 'matchedUsers' }
		]
	  });
  
	  if (!currentUser) {
		return res.status(404).json({
		  success: false,
		  message: "User not found",
		});
	  }
  
	  // Extract IDs from associations
	  const likedIds = currentUser.likedUsers?.map(user => user.id) || [];
	  const dislikedIds = currentUser.dislikedUsers?.map(user => user.id) || [];
	  const matchedIds = currentUser.matchedUsers?.map(user => user.id) || [];
	  
	  // Combine all IDs to exclude
	  const excludedIds = [...likedIds, ...dislikedIds, ...matchedIds];


// Assuming currentUser is defined properly
console.log('currentUser'); // Debugging line
console.log(currentUser); // Debugging line
console.log('excludedIds'); // Debugging line
console.log(excludedIds); // Debugging line

const users = await User.findAll({
  where: {
	id: {
		[Op.ne]: currentUser.id, // Exclude current user
		// [Op.notIn]: excludedIds.length > 0 ? excludedIds : [null], // Exclude specific users
	},


    // id: {
    //   [Op.ne]: currentUser.id, // Exclude current user
    //   [Op.notIn]: excludedIds.length > 0 ? excludedIds : [null], // Exclude specific users
    // },
    // Gender filtering based on preference
    // gender: {
    //   [Op.or]: currentUser.genderPreference === "both"
    //     ? { [Op.in]: ["male", "female"] } // Allow both male and female
    //     : currentUser.genderPreference,  // Otherwise, match exact gender
    // },
    // genderPreference: {
    //   [Op.in]: [currentUser.gender, "both"], // Check if the user's gender preference matches
    // },
  },
});

console.log(users); // Debugging line to check the result

	  
	
	  
	  res.status(200).json({
		success: true,
		users,
	  });
	} catch (error) {
	  console.log("Error in getUserProfiles: ", error);
	  res.status(500).json({
		success: false,
		message: "Internal server error",
	  });
	}
  };