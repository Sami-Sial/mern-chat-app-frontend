const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const ExpressError = require("../utils/ExpressError");
const asyncErrorHandler = require("../utils/wrapAsync");
const sendEmail = require("../utils/sendEmail");

// Register user
const registerUser = asyncErrorHandler(async (req, res, next) => {
  console.log("file", req.file);
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ExpressError(400, "All fields are required."));
  }

  const user = await User.findOne({ email });
  if (user) {
    return next(
      new ExpressError(400, "A user with given Email already exists.")
    );
  }

  bcrypt.hash(password, 10, function (err, hash) {
    saveUser(hash);
  });

  const saveUser = async (hashedPassword) => {
    password = hashedPassword;
    const newUser = new User({ name, email, password, pic: req.file ? req.file.path : undefined });
    const user = await newUser.save();

    if (user) {
      let token = generateToken(user._id);
      res.status(200).json({ user, token });
    } else {
      return next(new ExpressError(400, "Failed to create User."));
    }
  };
});

// Get Logged In user Info
const getLoggedInUser = asyncErrorHandler(async (req, res, next) => {
  let user = req.user;
  res.status(200).json({ user });
});

// Login user
const loginUser = asyncErrorHandler(async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return next(new ExpressError(400, "Email and password is required."));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ExpressError(404, "Email or password is incorrect"));
  } else {
    const hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      isUserExists(result);
    });
  }

  const isUserExists = (result) => {
    if (result == true) {
      req.user = user;
      let token = generateToken(user._id);
      res.status(200).json({ user, token });
      console.log("Successfully logged in");
    } else {
      return next(new ExpressError(400, "Email or password is incorrect."));
    }
  };
});


// All users
const allUsers = asyncErrorHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user._id },   // exclude current logged-in user
  });

  res.send(users);
});


const updatePassword = asyncErrorHandler(async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return next(
        new ExpressError(400, "Current and new password are required.")
      );
    }

    // 1. Find user
    const user = await User.findById(userId);
    if (!user) {
      return next(new ExpressError(404, "User not found."));
    }

    // 2. Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new ExpressError(400, "Current password is incorrect."));
    }

    // 3. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });

  } catch (error) {
    console.error("Password update error:", error);
    return next(new ExpressError(500, "Internal server error."));
  }
});

// Update Profile Picture
const updatePic = asyncErrorHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ExpressError(400, "Please upload a picture"));
  }
  const user = await User.findById(req.user._id);
  user.pic = req.file.path;
  await user.save();
  res.status(200).json({ success: true, user });
});


// Forgot Password
const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ExpressError(400, "Email is required."));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ExpressError(404, "User not found with this email."));
  }

  // Generate a token valid for 1 hour
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Talk-A-Tive Password Reset',
      message: message,
    });

    res.status(200).json({ success: true, message: 'Password reset link sent to email.' });
  } catch (err) {
    console.error('Email could not be sent:', err);
    return res.status(500).json({ error: 'Email could not be sent. Make sure EMAIL credentials are correct in .env' });
  }
});

// Reset Password
const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return next(new ExpressError(400, "New password is required."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ExpressError(404, "User not found."));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const contactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const emailMessage = `
      You have received a new message from the Talk-A-Tive Contact Form:
      
      Name: ${name}
      Email: ${email}
      Subject: ${subject || 'No Subject'}
      Message:
      ${message}
    `;

    await sendEmail({
      email: process.env.EMAIL_USER, // Send it to the site owner
      subject: `Contact Form Submission: ${subject || 'No Subject'}`,
      message: emailMessage,
    });

    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact form email failed:', error);
    res.status(500).json({ error: 'Failed to send message. Make sure EMAIL credentials are correct in .env' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  allUsers,
  getLoggedInUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  contactForm,
  updatePic
};
