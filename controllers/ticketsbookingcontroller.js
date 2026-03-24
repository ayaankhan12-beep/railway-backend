











const ticketsmodel = require("../models/ticketsmodel");
const cloudinary = require("../cnfig/cloudinary");
const transporter = require("../cnfig/mailer");
const generatepdf = require("../cnfig/pdfgenerate");
const AddtrainModel = require("../models/Addtrainmodel");
const uploadTocloud = require("../middleware/upload");

const booking = async (req, res) => {
  try {
    const { trainId } = req.params;
    const { name, cnic, Age, email  } = req.body;

    if (!name || !cnic || !Age || !email) {
      return res.status(400).json({
        isSuccessful: false,
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Image is required",
      });
    }

    // CNIC duplicate check
    const existing = await ticketsmodel.findOne({ cnic });
    if (existing) {
      return res.status(409).json({
        isSuccessful: false,
        message: "This CNIC is already used",
      });
    }

    // Train check
    const train = await AddtrainModel.findById(trainId);
    if (!train) {
      return res.status(404).json({
        isSuccessful: false,
        message: "Train not found",
      });
    }

    // Upload image to cloud
    const result = await uploadTocloud(req.file.buffer);
console.log(result.secure_url); 
    // Create ticket
    const ticket = await ticketsmodel.create({
      name,
      cnic,
      Age,
      email,
      image: result.secure_url,
      train: trainId,
    });

    // Generate PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generatepdf(ticket, train);
    } catch (err) {
      console.log("PDF Error:", err.message);
      pdfBuffer = null;
    }

    // Send email
    // try {
    //   await transporter.sendMail({
    //     from: `"Railway Ticket" <${process.env.SENDER_EMAIL}>`,
    //     to: email,
    //     subject: "Your Train Ticket 🎟️",
    //     text: "Your ticket is attached as PDF",
    //     attachments: pdfBuffer
    //       ? [
    //           {
    //             filename: "ticket.pdf",
    //             content: pdfBuffer,
    //             contentType: "application/pdf",
    //           },
    //         ]
    //       : [],
    //   });

    // } catch (err) {
    //   console.log("Email Error:", err.message);
    //   // Fail silently, ticket is still booked
    // }

    return res.status(201).json({
      isSuccessful: true,
      message: "Ticket Confirmed Successfully",
      ticket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isSuccessful: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { booking };