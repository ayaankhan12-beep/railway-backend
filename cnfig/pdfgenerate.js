
const PdfDocument = require("pdfkit")
const axios = require("axios")


const generatepdf = async (ticket , train) => {
    return new Promise(async (resolve , reject) => {

        try {
        const doc = new PdfDocument({size: "A4" , margin: 50})
        const buffers = []

        doc.on("data" , buffers.push.bind(buffers))
        doc.on("end" , () => {
            const pdfdata = Buffer.concat(buffers)
        resolve(pdfdata)
        })

        doc
        .fontSize(15)
        .text("Train ticket" , {align: "center"})
        .moveDown()



        .fontSize(12)
        .text(`Name: ${ticket.name}`)
         .text(`Cnic: ${ticket.cnic}`)
         .text(`Age: ${ticket.Age}`)
         .text(`Email: ${ticket.email}`)
         .text(`TrainName: ${train.TrainName}`)
         .text(`TrainNum: ${train.TrainNum}`)
         .moveDown()


         if(ticket.image){
            const response = await axios.get(ticket.image , {responseType: "arraybuffer"})
            const imagebuffer = Buffer.from(response.data , "binary")
            doc.image(imagebuffer , {fit: [150 , 150] , align: "center"})
         }

        doc.moveDown()

        doc.text("Ticket ID:" , {continued: true})
        doc.font("Helvetica-Bold")
        doc.text(`${ticket._id}`)

        doc.moveDown(2)

        doc.text("thank you for booking" , {align: "center"})

        doc.end()




    

} catch(err){
reject(err)
console.log(err.message)
}
    })
}

module.exports = generatepdf
