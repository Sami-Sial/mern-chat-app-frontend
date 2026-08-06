const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary.config");
const upload = multer({ storage });
const { isLoggedIn } = require("../middlewares/middleware");
const {
  registerUser,
  loginUser,
  allUsers,
  getLoggedInUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  contactForm,
  updatePic
} = require("../controllers/user.controllers");

router.post("/signup", upload.single("pic"), registerUser);
router.post("/login", loginUser);
router.get("/all-users", isLoggedIn, allUsers);
router.get("/me", isLoggedIn, getLoggedInUser);
router.put("/update-password", isLoggedIn, updatePassword);
router.put("/update-pic", isLoggedIn, upload.single("pic"), updatePic);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/contact", contactForm);

module.exports = router;
