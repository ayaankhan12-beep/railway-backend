
const express = require("express")

const mongoose = require("mongoose")

const {Addtrain , getTrain, DeleteTrain } = require("../controllers/Addtraincontroller")

const { checkAdmin } = require("../controllers/usercontroller")

const AddtrainRouter = express.Router()


AddtrainRouter.post("/Addtrain",checkAdmin, Addtrain)
AddtrainRouter.get("/getTrain" , getTrain)

AddtrainRouter.delete("/DeleteTrain/:id", checkAdmin, DeleteTrain)


module.exports = AddtrainRouter

