const cloudinary  = require("../cnfig/cloudinary")

const streamifier = require("streamifier")


const uploadTocloud = (fileBuffer) => {
    return new Promise((resolve , reject) => {
        let stream = cloudinary.uploader.upload_stream({
            folder: "usersimages"
        },
            (error , result) => {
            if(error) {
              return  reject(error)
            } else{
                resolve(result)
            }
        })
        streamifier.createReadStream(fileBuffer).pipe(stream)
    })

}


module.exports = uploadTocloud