const AddtrainModel = require("../models/Addtrainmodel")


const Addtrain = async (req , res) => {

try {
    const {TrainName , TrainNum , DepratureTime , arrivaltime,  date , To , ticketprice , Category} = req.body

    
    if(!TrainName  ||!TrainNum  ||!DepratureTime  ||!arrivaltime || !date ||!To ||!ticketprice ||!Category){
        res.send({
            isSucessfull:false,
            message: "please all fields are required"
        })
    }
        

    

    const existing = await AddtrainModel.findOne({date , DepratureTime})

    if(existing) {
        return res.status(401).send({
            isSucessfull: false,
            message: "This DepratureTime is already exist for this date"
        })
        
    } 



    const Trains = await  AddtrainModel.create({
        TrainName,
        TrainNum,
        DepratureTime,
        arrivaltime,
        date,
        To,
        ticketprice,
        Category
    })

    res.status(201).send({
    isSucessfull: true,
    message:"Train Scedule is set",
    data: Trains

    
    })




} catch (error) {
    res.status(404).send({
        isSucessfull: false,
        message: "train scedule is not set",
        error: error.message

    })
}

}


const getTrain = async (req , res) => {
    try {
        const trains = await AddtrainModel.find({})

        res.status(201).send({
            isSucessfull: true,
            message: "Get train Scedule",
            data: trains
        })




    } catch (error) {
        res.status(500).send({
            isSucessfull: false,
            message: "Scdeule is not get",
            error: error.message
        })
        
    }
}




const DeleteTrain = async(req , res) => {
    try {
        const {id} = req.params
        
        const finding = await AddtrainModel.findByIdAndDelete(id)

        if(!finding) {
            res.status(404).send({
                isSucessfull:true,
                message: "Train not found",
                
            })
        } 

        res.status(201).send({
            isSucessfull: true,
            message: "Train Deleted successfully",
            deleted: finding

        })
    } catch (error) {
        res.send({
                isSucessfull:false,
                message: "internal server err",
                error: error.message
            })
    }
}





module.exports = {Addtrain , getTrain , DeleteTrain  }