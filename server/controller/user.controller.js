const bcrypt = require("bcryptjs");
const UserModel = require("../model/user.model"); // confirm filename
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { Fullname, Email, Password } = req.body;
    const existingUser = await UserModel.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await UserModel.create({
      Fullname,
      Email,
      Password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create account",
      data: error.message,
    });
  }
};

const loginUsers = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const userDetails = await UserModel.findOne({ Email });
    if (!userDetails) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      Password,
      userDetails.Password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: userDetails._id, email: userDetails.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userDetails._id,
        Fullname: userDetails.Fullname,
        Email: userDetails.Email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Login failed",
      data: err.message,
    });
  }
};

module.exports = { createUser, loginUsers };
