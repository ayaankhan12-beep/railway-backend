// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port:587,
//   secure: false,
//   auth: {
//     user: process.env.BREVO_USER,
//     pass: process.env.BREVO_PASS, // App password
//   },
// });

// module.exports = transporter;







const SibApiV3Sdk = require('@getbrevo/brevo');

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];

apiKey.apiKey = process.env.BREVO_PASS;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (toEmail, pdfBuffer) => {
  try {
    await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.SEND_EMAIL,
        name: "Railway System"
      },
      to: [{ email: toEmail }],
      subject: "Your Train Ticket 🎟️",
      textContent: "Your ticket is attached as PDF",

      attachment: pdfBuffer
        ? [
            {
              content: pdfBuffer.toString("base64"), // ✅ IMPORTANT
              name: "ticket.pdf"
            }
          ]
        : []
    });

    console.log("✅ Email sent");
  } catch (err) {
    console.log("❌ Email error:", err.response?.text || err.message);
  }
};

module.exports = sendEmail;

