import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const sendToken = async (user, res) => {
  const accessToken = jwt.sign(
  {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  },
  process.env.JWT_ACCESS_TOKEN_SECRET,  // Use ACCESS token secret here
  { expiresIn: "7d" }
);

  res.status(201).json({
    success: true,
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
  });
};
