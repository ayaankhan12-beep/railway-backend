
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




// const PDFDocument = require("pdfkit");
// const axios = require("axios");

// const generatepdf = (ticket, train) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ size: "A4", margin: 50 });
//       const buffers = [];

//       doc.on("data", buffers.push.bind(buffers));
//       doc.on("end", () => {
//         const pdfData = Buffer.concat(buffers);
//         resolve(pdfData); // ✅ Return PDF buffer
//       });

//       doc.on("error", (err) => reject(err));

//       // PDF content
//       doc.fontSize(18).text("Train Ticket", { align: "center" }).moveDown(1);

//       doc.fontSize(12)
//         .text(`Name: ${ticket.name}`)
//         .text(`CNIC: ${ticket.cnic}`)
//         .text(`Age: ${ticket.Age}`)
//         .text(`Email: ${ticket.email}`)
//         .text(`Train Name: ${train.TrainName}`)
//         .text(`Train Number: ${train.TrainNum}`)
//         .moveDown(1);

//       // Add image if exists
//       if (ticket.image) {
//         axios
//           .get(ticket.image, { responseType: "arraybuffer" })
//           .then((response) => {
//             const imageBuffer = Buffer.from(response.data, "binary");
//             doc.image(imageBuffer, { fit: [150, 150], align: "center" });
//             doc.moveDown(1);

//             doc.text(`Ticket ID: ${ticket._id}`, { continued: false });
//             doc.moveDown(2);
//             doc.text("Thank you for booking!", { align: "center" });

//             doc.end(); // ✅ End after image and text
//           })
//           .catch((err) => {
//             console.log("Image fetch error:", err.message);
//             // proceed without image
//             doc.text(`Ticket ID: ${ticket._id}`, { continued: false });
//             doc.moveDown(2);
//             doc.text("Thank you for booking!", { align: "center" });
//             doc.end();
//           });
//       } else {
//         // No image
//         doc.text(`Ticket ID: ${ticket._id}`, { continued: false });
//         doc.moveDown(2);
//         doc.text("Thank you for booking!", { align: "center" });
//         doc.end();
//       }
//     } catch (err) {
//       console.log("PDF generation error:", err.message);
//       reject(err);
//     }
//   });
// };

// module.exports = generatepdf;




