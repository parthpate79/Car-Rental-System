const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Username or Password",
      });
    }

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    console.log("Register Request:", req.body);

    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });

    await newUser.save();

    console.log("User Registered Successfully");

    res.send("User Registered Successfully");
  } catch (error) {
    console.log("REGISTER ERROR:");
    console.log(error);

    res.status(500).json(error);
  }
});

module.exports = router;