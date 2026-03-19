const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema(
  {
  name:{
    type:String,
    require:true
   } ,
   
   
   cnic:{
    type:String,
    require: true
   } ,

   Age: {
    type: String,
    require:true
   } ,

   image:{
    type:String,
    require:true
   },




   
},
  { timestamps: true }
)

const TicketModel = mongoose.model("bookedtickets", TicketSchema)

module.exports = TicketModel
