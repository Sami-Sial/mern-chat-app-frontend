const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using the .env configuration
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `Talk-A-Tive <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML formatting
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
