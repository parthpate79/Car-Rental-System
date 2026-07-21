const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    const user = await User.findOne({
      username,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Username or Password",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    const existingUser = await User.findOne({
      username,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new User({
      username,
      password,
      isAdmin: false,
    });

    await newUser.save();

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// ================= TEMPORARY ADMIN FIX =================

router.get("/fixadmin", async (req, res) => {
  try {
    const user = await User.findOne({
      username: "parthpatel79_",
    });

    if (!user) {
      return res.status(404).send("Admin user not found");
    }

    user.password = "Parth0!81#";
    user.isAdmin = true;

    await user.save();

    res.send("Admin password fixed successfully");
  } catch (error) {
    console.log("ADMIN FIX ERROR:", error);

    res.status(500).send("Error fixing admin account");
  }
});

module.exports = router;