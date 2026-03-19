







const TicketModel = require("../models/ticketsmodel");
const cloudinary = require("../cnfig/cloudinary");
const transporter = require("../cnfig/mailer");
const pdfgenerate = require("../cnfig/pdfgenerate");
const AddtrainModel = require("../models/Addtrainmodel");
const uploadTocloud = require("../middleware/upload");

const booking = async (req, res) => {
  try {
    const {trainId} = req.params
    const { name, cnic, Age, email } = req.body;

    // ✅ Required fields check
    if (!name || !cnic || !Age || !email) {
      return res.status(400).json({
        isSuccessful: false,
        message: "All fields are required"
      });
    }

    // ✅ Image check
    if (!req.file) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Image is required"
      });
    }

    // ✅ CNIC duplicate check
    const existing = await TicketModel.findOne({ cnic });
    if (existing) {
      return res.status(409).json({
        isSuccessful: false,
        message: "This CNIC is already used"
      });
    }

  
  const train = await AddtrainModel.findById(trainId)
  if(!train){
  return  res.send({
      isSuccessful: false,
      message: "train not found",
      
    })
  } 

    
    
        const result = await uploadTocloud(req.file.buffer)

    


  
    const ticket = await TicketModel.create({
      name,
      cnic,
      Age,
      email,
      image: result.secure_url,
      train: trainId,
    });

    // ✅ Generate PDF
    const pdfBuffer = await pdfgenerate(ticket , train)
  
       
    

    

    // ✅ Send Email
    await transporter.sendMail({
      from: `"Railway Ticket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Train Ticket 🎟️",
      text: "Your ticket is attached as PDF",
      attachments: [
        {
          filename: "ticket.pdf",
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    });

    return res.status(201).json({
      isSuccessful: true,
      message: "Ticket Confirmed Successfully",
      ticket
    });

  } catch (error) {
    return res.status(500).json({
      isSuccessful: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = { booking };