const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// ======================= LOGIN =======================

router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Username or Password",
      });
    }

    // Convert mongoose object to normal object
    const userObj = user.toObject();

    // Make your account Admin
    if (user.username === "parthpatel79_") {
      userObj.isAdmin = true;
    } else {
      userObj.isAdmin = false;
    }

    res.send(userObj);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });

  }

});


// ======================= REGISTER =======================

router.post("/register", async (req, res) => {

  try {

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

      isAdmin: false

    });

    await newUser.save();

    res.send("User Registered Successfully");

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Registration Failed",
    });

  }

});

module.exports = router;