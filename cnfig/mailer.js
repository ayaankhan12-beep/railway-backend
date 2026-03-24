const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port:587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.BREVO_PASS, // App password
  },
});

module.exports = transporter;