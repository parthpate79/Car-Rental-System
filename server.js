const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://carrentalbyparthdarshil.netlify.app",
  "https://car-rental-system-phi-one.vercel.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, server-to-server requests and same-origin requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Request logger without displaying passwords or request bodies.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/cars", require("./routes/carsRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/bookings", require("./routes/bookingsRoute"));
app.use(
  "/api/car-listings",
  require("./routes/carListingRoutes")
);
app.use(
  "/api/uploads",
  require("./routes/uploadRoute")
);
app.use(
  "/api/reviews",
  require("./routes/reviewRoutes")
);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DriveEase Car Rental API is running",
  });
});

// Serve React build if frontend and backend are deployed together.
if (process.env.NODE_ENV === "production") {
  const path = require("path");

  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(
      path.resolve(__dirname, "client", "build", "index.html")
    );
  });
}

// API 404 handler.
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// General error handler.
app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error.message);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

const startServer = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is missing");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connection Successful");

    app.listen(port, () => {
      console.log(`DriveEase server started on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

