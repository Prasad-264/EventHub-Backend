const User = require('../models/User');
const Interest = require('../models/Interest');
const bcrypt= require('bcrypt');
const Interests = require('../models/Interest');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get User details using userId
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in getting user details", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const addInterest = async (req, res) => {
  try {  
    const { userId } = req.params;
    const { interestName } = req.body;

    const interest = await Interest.findOne({ name: interestName });

    if (!interest) {
      return res.status(404).json({ error: "Interest not found" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { interests: interest._id } },
      { new: true }
    ).populate('interests');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Interests added successfully" });
  } catch (error) {
    console.error("Error adding interest", error);
    res.status(500).json({ error: "Failed to add interest" });
  }
};

const removeInterest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { interestName } = req.body;

    const interest = await Interest.findOne({ name: interestName });

    if (!interest) {
      return res.status(404).json({ error: "Interest not found" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { interests: interest._id } },
      { new: true }
    ).populate('interests');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Interests removed successfully" });
  } catch (error) {
    console.error("Error removing interest", error);
    res.status(500).json({ error: "Failed to remove interest" });
  }
};

module.exports = { 
  registerUser, 
  getUserById,
  addInterest,
  removeInterest,
  deleteUser,
};