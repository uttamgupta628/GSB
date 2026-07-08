const OTP = require("../models/OTP");

const verifyOtp = async (email, otp) => {
  try {
    const otpData = await OTP.findOne({ email });

    if (!otpData) {
      throw new Error("OTP not found");
    }

    if (otpData.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    if (otpData.willExpireAt < new Date()) {
      await OTP.findOneAndDelete({ email });
      throw new Error("OTP has expired");
    }
    await OTP.findOneAndDelete({ email });
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = verifyOtp;
