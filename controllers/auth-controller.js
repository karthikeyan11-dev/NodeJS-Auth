const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Registeration Auth
const registerUser = async (req, res) => {
  try {
    //Taking User information form the request body
    const { username, email, password, role } = req.body;
    //Checking the user is already existing
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with same Username or Email",
      });
    }
    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Saving to the DataBase
    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "User",
    });

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "Signup Successful",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user please try agian",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong try again",
    });
  }
};

// Login Auth
const loginUser = async (req, res) => {
  try {
    //Getting the ogin credentials from the request body
    const { username, password } = req.body;
    //Checking the user already exists
    const user = await User.findOne({username});
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const AccessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    res.status(200).json({
      success : true,
      message : "Login successful",
      AccessToken
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong try again",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
