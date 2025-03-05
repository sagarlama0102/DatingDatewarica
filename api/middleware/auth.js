import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


export const protectRoute = async (req, res, next) => {
  try {
    // Check if the token exists in cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    // Verify the token and decode the payload
    const decoded = jwt.verify(token, 'b33b3k'); // Make sure your secret key is properly stored in environment variables

    // Ensure the decoded object contains an id
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
      });
    }
    console.log("decoded");
    console.log(decoded);
    console.log(decoded.id);

    // Find the user by the decoded ID
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach the user to the request object
    req.user = currentUser;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error in auth middleware: ", error);

    // Handle JWT errors specifically
    if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
    });
    }

    // Catch any other errors and respond with 500
    return res.status(500).json({
    success: false,
    message: "Internal server error",
    });
}
};

