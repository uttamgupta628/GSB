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
      console.log("Email sent successfully: ", info);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  }
}

module.exports = EmailService;