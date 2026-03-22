const mongoose = require("mongoose")

const connecting = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected")
  } catch (error) {
    console.log("MongoDB error:", error)
    message.error("db failed")

  }
}

module.exports = connecting