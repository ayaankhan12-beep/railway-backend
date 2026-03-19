const express = require("express")
const mongoose = require("mongoose")
const {signUp , login , Logout, verifyOtp , resend , checkAuth , checkAdmin} = require("../controllers/usercontroller.js")
const AuthRouter = express.Router()



AuthRouter.post("/signUp" , signUp)

AuthRouter.post("/login" , login)
AuthRouter.post("/Logout" , Logout)
AuthRouter.post("/verifyOtp/:userId" , verifyOtp)
AuthRouter.post("/resend/:userId" , resend)
AuthRouter.get("/checkAuth" , checkAuth)
AuthRouter.get("/checkAdmin" , checkAdmin)



module.exports = AuthRouter
