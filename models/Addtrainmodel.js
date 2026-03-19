const mongoose = require("mongoose");

const AddtrainSchema = new mongoose.Schema(
  {
    TrainName: {
      type: String,
      required: true
    },
    TrainNum: {
      type: String,
      required: true
    },
    DepratureTime: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    arrivaltime: {
      type: String,
      required: true
    },
    To: {
      type: String,
      required: true
    },
    ticketprice: {
      type:Number,
      required: true
    },
    Category: {
      type: String,
      enum: ["BussniessClass" , "normal"],
      
    }
   
  },
  { timestamps: true }
);

AddtrainSchema.index(
  { date: 1, DepratureTime: 1 },
  { unique: true }
);

const AddtrainModel = mongoose.model("Schedules", AddtrainSchema);

module.exports = AddtrainModel;