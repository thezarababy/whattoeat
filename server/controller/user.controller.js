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

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// GET ONE USER
const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};
// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If updating password, hash it
    if (updates.Password) {
      updates.Password = await bcrypt.hash(updates.Password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};
// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  createUser,
  loginUsers,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
};
