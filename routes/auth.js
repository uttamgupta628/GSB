const express = require("express");
const router = express.Router();
const User = require("../models/User");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
var validator = require("email-validator");
const EmailService = require("../Mail/transporter");
const { generateOtP } = require("../utils/OTPGenerator");
const OTP = require("../models/OTP");
const verifyOtp = require("../utils/VerifyOtp");

require("dotenv").config();

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const verifyServiceSid = process.env.VERIFY_SERVICE_SID;
const jwtSecret = process.env.JWT_SECRET;

// Route to handle sending OTP
router.post("/phone-login", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    // Find or create user by phone number

    const validateEmail = validator.validate(email);

    if (!validateEmail) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Email!" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      console.log("User not found, creating new user...");
      user = new User({ email, verified: false, firstTimeLogin: true });
      await user.save();
    }

    // Send OTP to the user's phone number
    const sixDigitOtp = generateOtP();

    const existingOtp = await OTP.findOne({ email });

    let newOtp;

    if (existingOtp) {
      existingOtp.otp = sixDigitOtp;
      existingOtp.willExpireAt = new Date(Date.now() + 600000);

      await existingOtp.save();
    } else {
      newOtp = await OTP.create({
        email,
        otp: sixDigitOtp,
        willExpireAt: new Date(Date.now() + 600000),
      });
      if (!newOtp) {
        return res.status(500).send({
          success: false,
          message: "Failed to generate OTP. Please try again later.",
        });
      }
    }
    const emailService = new EmailService();
    emailService.sendOTP(email, sixDigitOtp);

    res.status(200).send({ success: true, message: "OTP sent to your mail." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Route to handle OTP verification
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Find user by phone
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    const verificationCheck = await verifyOtp(email, otp);

    if (verificationCheck) {
      // Mark the user as verified
      user.verified = true;
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "90d" });

      // Spread user data directly into the response object
      const { _id, email, verified, isAdmin } = user._doc;

      if (user?.firstTimeLogin) {
        user.firstTimeLogin = false;
        await user.save();
        return res.status(200).send({
          success: true,
          message: "User verified successfully.",
          token,
          user,
          _id,
          email,
          verified,
          isAdmin: isAdmin ? true : false,
          firstTimeLogin: true,
        });
      }

      res.status(200).send({
        success: true,
        message: "User verified successfully.",
        token,
        user,
        _id,
        email,
        verified,
        isAdmin: isAdmin ? true : false,
        firstTimeLogin: false,
      });
    } else {
      res.status(400).send({ success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
});

router.post("/admin-login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    if (
      phone !== process.env.ADMIN_PHONE ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Credentials" });
    }

    if (
      phone === process.env.ADMIN_PHONE &&
      password === process.env.ADMIN_PASSWORD
    ) {
      jwt.sign(
        { id: process.env.ADMIN_PHONE },
        jwtSecret,
        { expiresIn: "90d" },
        (err, token) => {
          if (err) {
            console.log(err);
            return res.status(500).send({ success: false, error: err.message });
          }
          res.status(200).send({
            success: true,
            message: "Admin logged in successfully",
            token,
            user: {
              _id: process.env.ADMIN_PHONE,
              phoneNumber: process.env.ADMIN_PHONE,
              isAdmin: true,
            },
          });
        }
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
});
module.exports = router;
