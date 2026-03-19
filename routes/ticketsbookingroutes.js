const express = require("express")
const mongoose = require("mongoose")
const {booking } = require("../controllers/ticketsbookingcontroller")
const TicketRouter = express.Router()

const multer = require("../middleware/multer")

TicketRouter.post("/booking/:trainId" ,multer, booking)





module.exports = TicketRouter
