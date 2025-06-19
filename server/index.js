import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "./middleware/auth.js";
import prisma from "./utils/prisma.js";
import { sendToken } from "./utils/sendToken.js";

dotenv.config();
console.log("JWT_SECRET_KEY from env:", process.env.JWT_SECRET_KEY);


const app = express();
const PORT = 3000;

app.use(express.json({ limit: "100mb" }));

async function testPrisma() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to DB successfully");
  } catch (error) {
    console.error("❌ Prisma connection error:", error);
  }
}
testPrisma();

// Routes
app.post("/login", async (req, res) => {

  try {
      console.log("🔥 /login route hit");
    console.log("Request body:", req.body);
    const { signedToken } = req.body;
     console.log("Signed token:", signedToken);
    const data = jwt.verify(signedToken, process.env.JWT_SECRET_KEY);
        console.log("JWT payload data:", data);
    if (data) {
      const isUserExist = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
      if (isUserExist) {
        await sendToken(isUserExist, res);
      } else {
        const user = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            avatar: data.avatar,
          },
        });
        await sendToken(user, res);
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Your request is not authorized!",
      });
    }
  } catch (error) {
      console.error("❌ JWT verification failed:", error.message);
  return res.status(401).json({
    success: false,
    message: "Unauthorized request",
  });
  }
 
});

app.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

  app.get("/get-courses", async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        courseData: {
          include: {
            links: true,
          },
        },
        benefits: true,
        prerequisites: true,
      },
    });

    res.status(201).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server - this must be outside all route handlers
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
