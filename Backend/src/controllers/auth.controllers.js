const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

//  register a User
async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    //  check all field given or not
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide all field name , email , password",
      });
    }

    // check already user exist or not
    const isUserAlreadyExist = await User.findOne({
      email,
    });

    if (isUserAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User register successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//  login a User

async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // check  Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        message: "invalid credentials ",
      });
    }

    // token  generate
    const token = generateToken(user._id)


    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // in  production we keep  true
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { registerUserController, loginUserController };
