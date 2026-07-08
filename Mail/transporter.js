const { Resend } = require('resend');

class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOTP(email, otp) {
  if (!email || !otp) {
    console.error("Email and OTP are required to send an email.");
    return;
  }

  try {
    const info = await this.resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "This is from GSB: Your OTP",
      text: `Your OTP is: ${otp}`,
      html: `<div style="font-family: Arial, sans-serif; text-align: left;">
             <h2 style="color:rgb(255, 215, 0);">Your OTP Code</h2>
             <p style="font-size: 16px;">Your OTP is: <strong>${otp}</strong></p>
             <p style="font-size: 14px; color: #888;">Please use this code to complete your verification.</p>
           </div>`,
    });

    if (info.error) {
      console.error("Email failed to send:", info.error);
      throw new Error(info.error.message);
    }

    console.log("Email sent successfully:", info.data);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // let the caller know it failed, e.g. so it doesn't tell the user "OTP sent" falsely
  }
}
}

module.exports = EmailService;