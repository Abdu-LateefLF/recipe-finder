if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
const verifyToken = require("./middleware/verifyToken");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/user");
const searchRoutes = require("./routes/searches");

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Connect to database
mongoose
  .connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/recipefinder")
  .then(() => {
    console.log("Connected to database successfully!");
  })
  .catch(() => {
    console.log("Failed to connect to server");
  });

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSanitize());

console.log("Allowed Origin: ", process.env.ORIGIN);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", verifyToken, userRoutes);
app.use("/api/recipes", verifyToken, recipeRoutes);
app.use("/api/searches", verifyToken, searchRoutes);

// Start Server on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
