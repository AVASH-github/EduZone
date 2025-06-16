import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.headers["authorization"];

    if (accessToken && accessToken.startsWith("Bearer ")) {
      const token = accessToken.slice(7);

      // verify the token
      const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      console.log("✅ Token decoded. User ID:", userData.id);

      // fetching user data
      const user = await prisma.user.findUnique({
        where: { id: userData.id },
        include: {
          orders: true,
          reviews: true,
          Tickets: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Authentication failed.",
        });
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Authentication token is missing or invalid.",
      });
    }
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid token. Authentication failed.",
    });
  }
};
