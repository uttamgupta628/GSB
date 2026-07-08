const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTP(email, otp) {
    if (!email || !otp) {
      console.error("Email and OTP are required to send an email.");
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "This is from GSB: Your OTP",
      text: `Your OTP is: ${otp}`,
      html: `<div style="font-family: Arial, sans-serif; text-align: left;">
             <h2 style="color:rgb(255, 215, 0);">Your OTP Code</h2>
             <p style="font-size: 16px;">Your OTP is: <strong>${otp}</strong></p>
             <p style="font-size: 14px; color: #888;">Please use this code to complete your verification.</p>
           </div>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully: ", info.response);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  }
}

module.exports = EmailService;
