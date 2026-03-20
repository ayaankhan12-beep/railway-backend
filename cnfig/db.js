
require("dotenv").config()

const mongoose=  require ("mongoose")

const connect = async() => {
    try {
        await mongoose.connect(process.env.MONOGO_URI)

        console.log("Mongo connect")
    } catch {
        console.log("Mongo Error")
    }
}

module.exports = connect