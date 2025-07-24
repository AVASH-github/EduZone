import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "./middleware/auth.js";
import prisma from "./utils/prisma.js";
import { sendToken } from "./utils/sendToken.js";
import nodemailer from "nodemailer";
import sendEmail from "./utils/sendEmail.js";

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



//testing khalti integration 
app.get("/khalti-verify-payment", async (req, res) => {
  console.log("📥 Incoming query params:", req.query);

  const { pidx, userId } = req.query;
  let { purchase_order_id } = req.query;

  if (Array.isArray(purchase_order_id)) {
    purchase_order_id = purchase_order_id[0];
  }

  if (!pidx || !userId || !purchase_order_id) {
    return res.status(400).json({
      success: false,
      message: "Missing pidx, userId, or purchase_order_id",
    });
  }

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

    if (data.status !== "Completed") {
      return res.json({ success: false, message: "Payment not completed" });
    }

    if (!data.transaction_id) {
      return res.json({ success: false, message: "Missing transaction ID from Khalti" });
    }

    const existingOrder = await prisma.orders.findFirst({
      where: { transaction_id: data.transaction_id },
    });

    if (existingOrder) {
      return res.json({ success: true, message: "Already purchased" });
    }

    const order = await prisma.orders.create({
      data: {
        userId: String(userId),
        courseId: String(purchase_order_id),
        transaction_id: data.transaction_id,
        payment_info: "Khalti",
        product_id: data.purchase_order_name || "N/A",
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!user) {
      console.log("❌ User not found for email");
    } else {
      const subject = "🎉 Payment Successful - Course Purchase Confirmation";
      const htmlContent = `
        <h2>Payment Confirmation</h2>
        <p>Hi <b>${user.name}</b>,</p>
        <p>Your payment for course ID <strong>${purchase_order_id}</strong> has been successfully processed via <strong>Khalti</strong>.</p>
        <p><b>Transaction ID:</b> ${data.transaction_id}</p>
        <p>Thank you for purchasing!</p>
        <p>- EduZone Team</p>
      `;

      // Use your sendEmail helper here
      await sendEmail(user.email, subject, htmlContent);
      console.log("📧 Confirmation email sent to", user.email);
    }

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





// fetch questions
app.get(
  "/get-questions/:contentId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const contentId = req.params.contentId;
      const questions = await prisma.courseQuestions.findMany({
        where: {
          contentId,
        },
        include: {
          user: true,
          answers: {
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
        questions,
      });
    } catch (error) {
      res.status(501).json({ success: false, message: error.message });
    }
  }
);


// adding reply to question
app.put("/adding-reply", isAuthenticated, async (req, res) => {
  try {
    await prisma.courseQuestionAnswers.create({
      data: {
        questionId: req.body.questionId,
        answer: req.body.answer,
        userId: req.user.id,
      },
    });

    const q = await prisma.courseQuestions.findUnique({
      where: {
        id: req.body.questionId,
      },
      include: {
        user: true,
      },
    });

    if (q?.user.id !== req.user.id) {
      function truncateString(str, num) {
        if (str.length > num) {
          let end = str.substring(0, num).lastIndexOf(" ");
          return str.substring(0, end) + "...";
        }
        return str;
      }

      await prisma.notification.create({
        data: {
          title: `New Answer Received`,
          message: `You have a new answer in your question - ${truncateString(
            q.question,
            10
          )}`,
          creatorId: req.user?.id,
          receiverId: q.user.id,
          redirect_link: `https://www.becodemy.com/course-access/${
            req.body.courseSlug
          }?lesson=${req.body.activeVideo + 1}`,
          questionId: req.body.questionId,
        },
      });

      if (q.user.pushToken) {
        const courseData = await prisma.course.findUnique({
          where: {
            slug: req.body.courseSlug,
          },
        });
        const pushData = {
          to: q.user.pushToken,
          sound: "default",
          title: `New Answer Received`,
          body: `You have a new answer in your question - ${truncateString(
            q.question,
            10
          )}`,
          data: {
            ...courseData,
            activeVideo: req.body.activeVideo,
          },
        };

        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pushData),
        });
      }
    }

    const question = await prisma.courseQuestions.findMany({
      where: {
        contentId: req.body.contentId,
      },
      include: {
        user: true,
        answers: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(501).json({ success: false, message: error.message });
  }
});
// updating push token
app.put("/update-push-token", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        pushToken: req.body.pushToken,
      },
    });
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
});


// get notifications
app.get("/get-notifications", isAuthenticated, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [{ receiverId: req.user?.id }, { receiverId: "All" }],
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(201).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
});


// delete notification
app.delete(
  "/delete-notification/:id",
  isAuthenticated,
  async (req, res, next) => {
    try {
      await prisma.notification.delete({
        where: {
          id: req.params.id,
        },
      });

      const notifications = await prisma.notification.findMany({
        where: {
          OR: [{ receiverId: req.user?.id }, { receiverId: "All" }],
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error) {
      res.status(501).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// create ticket
app.post("/create-ticket", isAuthenticated, async (req, res) => {
  try {
    const { ticketTitle, details } = req.body;

    const ticket = await prisma.tickets.create({
      data: {
        ticketTitle,
        details,
        creatorId: req.user.id,
      },
    });
    res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
});


// get ticket replies
app.get("/get-ticket/:id", isAuthenticated, async (req, res) => {
  try {
    const ticket = await prisma.ticketReply.findMany({
      where: {
        ticketId: req.params.id,
      },
      include: {
        user: true,
      },
    });
    res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
});

// adding new reply
app.put("/ticket-reply", isAuthenticated, async (req, res) => {
  try {
    const { ticketId, ticketReply } = req.body;

    const reply = await prisma.ticketReply.create({
      data: {
        ticketId: ticketId,
        reply: ticketReply,
        replyId: req.user.id,
      },
      include: {
        user: true,
      },
    });

    await prisma.tickets.update({
      where: {
        id: ticketId,
      },
      data: {
        status: req.user.role === "Admin" ? "Answered" : "Pending",
      },
    });

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add reply",
    });
  }
});


