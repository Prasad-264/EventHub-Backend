const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

// login using email and password
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY_TOKEN, { expiresIn: '12h' });

    const userObject = user.toObject();
		delete userObject.password;
		res.status(200).json({ token, userObject });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};

module.exports = {
	registerUser,
	loginUser
};