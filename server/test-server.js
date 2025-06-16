import express from "express";

const app = express();
const PORT = 3000;

// Basic test route
app.get("/", (req, res) => {
  res.send("✅ Hello from test server!");
});

// Use your current IP address
app.listen(3000, "192.168.1.65", () => {
  console.log(`🚀 Test server running at http://192.168.1.65:${PORT}`);
});
