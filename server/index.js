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


app.get("/get-reviews/:courseId", async (req, res) => {
  const reviewsData = await prisma.reviews.findMany({
    where: {
      courseId: req.params.courseId,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.status(201).json({
    success: true,
    reviewsData,
  });
});

// Start server - this must be outside all route handlers
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



///testing khalti integration 

// Create order after verifying Khalti payment
app.get("/khalti-verify-payment", async (req, res) => {
  console.log("📥 Incoming query params:", req.query);

  const { pidx, userId } = req.query;
  let { purchase_order_id } = req.query;

  // 🛠️ Fix if it's an array (Khalti often sends it twice)
  if (Array.isArray(purchase_order_id)) {
    purchase_order_id = purchase_order_id[0];
  }

  // ❗Check presence of essential data
  if (!pidx || !userId || !purchase_order_id) {
    return res.status(400).json({
      success: false,
      message: "Missing pidx, userId, or purchase_order_id",
    });
  }

  console.log("🧾 Parsed values →");
  console.log("pidx:", pidx);
  console.log("purchase_order_id:", purchase_order_id);
  console.log("userId:", userId);

  try {
    const response = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await response.json();
    console.log("✅ Khalti verify response:", data);

    // ✅ Check status
    if (data.status !== "Completed") {
      return res.json({ success: false, message: "Payment not completed" });
    }

    // ✅ Extra check in case Khalti didn’t return order info
    if (!data.transaction_id) {
      return res.json({ success: false, message: "Missing transaction ID from Khalti" });
    }

    // ✅ Check for existing order
    const existingOrder = await prisma.orders.findFirst({
      where: { transaction_id: data.transaction_id },
    });

    if (existingOrder) {
      return res.json({ success: true, message: "Already purchased" });
    }

    // ✅ Create order in DB
    const order = await prisma.orders.create({
      data: {
        userId: String(userId),
        courseId: String(purchase_order_id),
        transaction_id: data.transaction_id,
        payment_info: "Khalti",
        product_id: data.purchase_order_name || "N/A",
      },
    });

    return res.json({
      success: true,
      message: "Payment verified and order created",
      courseId: purchase_order_id,
      userId,
      order,
    });
  } catch (error) {
    console.error("❌ Error verifying Khalti payment:", error);
    return res.json({ success: false, message: "Verification failed" });
  }
});


