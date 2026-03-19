

const mongoose=  require ("mongoose")

const connect = async() => {
    try {
        await mongoose.connect( "mongodb+srv://Ayaan:ayu12345@cls.crsuq40.mongodb.net")

        console.log("Mongo connect")
    } catch {
        console.log("Mongo Error")
    }
}

module.exports = connect