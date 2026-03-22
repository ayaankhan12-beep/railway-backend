require("dotenv").config()
const express = require("express")
const app = express()

const connecting = require("./cnfig/db")
const cors = require("cors")
const AuthRouter = require("./routes/routes.js")
const TicketRouter = require("./routes/ticketsbookingroutes.js")
const cookieparser = require("cookie-parser")
const AddtrainRouter = require("./routes/Addtrainrouter.js")



app.use(express.json())
app.use(cors({
  origin: "https://railway-system-xx.vercel.app/", // frontend url
  credentials: true

}

))
app.use(cookieparser())

app.get("/" , (req , res) => {
  res.json({
  message: "server started"
  })
})

app.get("/test" , (req , res) => {
res.send({
  message: "test is start"
})
})

app.use("/" , AuthRouter)
app.use("/" , TicketRouter)
app.use("/" , AddtrainRouter)

// DB connect 
const startServer = async () => {
  try {
    
  await connecting()

    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000")
    })
  } catch (error) {
  console.log("server error:" , error)
  }
}


startServer()
