const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    
    },
    password: {
      type: String,
      required: true,
      unique:true
    },
  
  email: {
type: String,
required:true,
unique: true
  } ,
role: {
  type: String,
  enum: ["Admin" , "user"],
  default: "user"

},
  verifyOtp: {
    type:Number,
  

  },
  OtpExpire:{
    type: Date
  } ,
  isVerified: {
    type: Boolean,
    default: false
  },
  resend: {
    type:Number,
    
  } 

  
},
  { timestamps: true }
)

const CourseModel = mongoose.model("new", CourseSchema)

module.exports = CourseModel
