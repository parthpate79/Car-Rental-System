const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Database Connection
require("./db");

// Middlewares
app.use(cors());
app.use(express.json());

// Test Middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log(req.body);
  next();
});

// Routes
app.use("/api/cars", require("./routes/carsRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/bookings", require("./routes/bookingsRoute"));

// Home Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Production
if (process.env.NODE_ENV === "production") {
  const path = require("path");

  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start Server
app.listen(port, () => {
  console.log(`Node JS Server Started in Port ${port}`);
});