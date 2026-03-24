

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const CourseModel = require("../models/CourseModel");
const transporter  = require("../cnfig/mailer");


const signUp = async (req, res) => {
  try {
    const { username, email, password  } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Please fill all the fields"
      });
    }

    
   const existing = await CourseModel.findOne({ email });
    if (existing) {
      return res.status(409).json({
        isSuccessful: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const Otp = Math.floor(100000 + Math.random() * 900000)
    const user = await CourseModel.create({
      username,
      email,
      password: hashedPassword,
      verifyOtp: Otp,
      OtpExpire: Date.now()+ 2*60*1000
    });

await user.save()

    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        isSuccessful: false,
        message: "JWT secret is not set in .env"
      });
    }

    const token = jwt.sign(
      { id: user._id , role: user.role},
      
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ,          // HTTPS required in production
  sameSite: process.env.NODE_ENV === "production"  ? "none" : "lax",  // cross-site cookie
  maxAge: 5 * 24 * 60 * 60 * 1000       
});


      
const mailoption = {
  
    
      from:`SignUp message <${process.env.EMAIL_USER}>`,
      to: email,
      subject:"Your OTP code",
      text:`Your OTP is ${Otp}`
    
}
    await transporter.sendMail(mailoption)
      


    
  

    return res.status(201).json({
      isSuccessful: true,
      message: "Successfully Registered",
     userId: user._id,
  
     
      

    });

    
    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccessful: false,
      message: error.message
    });
  }
};


const login = async(req , res) => {

    const {email ,password} = req.body

    try {
        
        const user = await CourseModel.findOne({email})

        if(!user){
          return  res.send({
                isSucessful: false,
                message: "invalid email"
            })
        }

        const match = await bcrypt.compare(password , user.password)

        if (!match) {
          return  res.send({
                isSucessfull: false,
                message: "invalid password"
            })
        }



        const token = jwt.sign({id: user._id, role:user.role} , process.env.JWT_SECRET , {expiresIn: "5d"} )

              

res.cookie("token", token, {
  
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ,          
  sameSite: process.env.NODE_ENV === "production" ? "none"  : "lax", 
  maxAge: 5 * 24 * 60 * 60 * 1000,        // 30 days
});


         res.json({
            isSucessfull: true,
            message: "Sucessfully Login",
            role: user.role
            
        })



       
    } 
    catch (error) {
        res.send({
            isSucessful: false,
            error: error.message
        })
    }
}



const Logout =  (req , res) => {
try {
   res.clearCookie("token" , {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
   })
    

  
   return  res.send({
        isSucessfull:true,
        message: "User is Loggedout",
        
    })
  
  }

    
 catch (error) {
    res.send({
        isSucessfull: false,
        message: "internal server error"
    })
    
}
}



const verifyOtp = async(req , res) => {

  try {
    const {userId} = req.params
  const {  Otp} = req.body

const user = await CourseModel.findById(userId)

  if(!user) {
    return res.send({
      isSuccessful: false,
      message: "user not found"
    })
  }

  if(user.verifyOtp !== Number(Otp)){
  return  res.send({
      isSuccessful: false,
      message: "Invalid Otp"
    })
  }

  if(user.OtpExpire < Date.now()){
    return res.send({
      isSuccessful: false,
      message: "Otp is expired"
    })
  } 

  user.isVerified = true;
  user.verifyOtp = null;
  user.OtpExpire = null

  await user.save()

 res.status(201).send({
    isSuccessful: true,
    message: "Account verified"
  })

  } catch (error) {
    res.send({
      isSucessful: false,
      error: error.message
    })
  }


}


const resend = async (req , res) => {
  try{
  const {userId} = req.params

  const user = await CourseModel.findById(userId)

  if(!user) {
    return res.status(300).send({
      isSuccessfu: false ,
      message: "user not found"
    })
  }
  if(user.isVerified){
    return res.send({
      issuccessful: false,
      message: "user is Already Verified"
    })
  }
  const Otp = Math.floor(100000 + Math.random() * 900000) 
  const OtpExpire = Date.now() + 2*60*1000

  user.verifyOtp = Otp;
  user.OtpExpire = OtpExpire;
  await user.save()

  transporter.sendMail({
    from:"SignUp message",
      to: email,
      subject:"Resend OTP code",
      text:`Your OTP is ${Otp}`
  })

  res.send({
    isSuccessful: true,
    message: "Resend Otp Success"
  })

  } catch(error) {
    res.status(400).send({
      isSuccessful: false,
      error: error.message
    })
  }


}

const checkAuth = async (req , res) => {
  try {
    const {token} = req.cookies

  if(!token) {
    return res.status({isAuthenticated: false , message: "token not found"})
  }

  const decoded = jwt.verify(token , process.env.JWT_SECRET)

  const user = await CourseModel.findById(decoded.id)

  if(!user){
    res.status(404).send({
      isAuthenticated: false,
      message: "user not found"
    })
  }

  res.status(201).send({
    isAuthenticated: true,
    message: "user is Authenticated",
    user: {
     id:  user._id,
      role: user.role
    }
  })
  } catch (error) {
    res.send({
      isAuthenticated: false,
      message: error.message
    })
  }
}


const checkAdmin = (req , res , next) => {
    const {token}= req.cookies
    console.log("token:" , token)

    if(!token) {
        return res.send({isSuccess: false , message: "not logged in"})
    }
const decoded = jwt.verify(token ,process.env.JWT_SECRET )

if(decoded.role !== "Admin") {
  return  res.send({
        isSuccess: false ,
        message: "admin access only"

    })
}
next()
}





module.exports = { signUp , login , Logout , verifyOtp , resend , checkAuth , checkAdmin}