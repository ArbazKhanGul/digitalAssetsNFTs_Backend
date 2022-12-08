const User = require('../database/user');
const sendEmail = require('../utils/sendEmail')
const jwt = require("jsonwebtoken");

exports.sendEmail=async (req, res) => {
    let value=req.body;
  // throw new Error("Wrong email address");
  
  const result=await User.findOne({ email: value.email});
  
  console.log("🚀 ~ file: router.js ~ line 113 ~ router.post ~ result", result)
  
    if(!result)
    {
     throw new Error("Email not registered")
    }
  
    if(result.verify)
    {
     throw new Error("Email already verified")
    }
  
    sendEmail(result);
  
    res.status(200).send({
        message: "success",
          })
    }

exports.emailVerify=async (req,res)=>{
    let {token} = req.params;
  
  
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
  
      const rootUSer = await User.findOne({ _id: verifyToken._id });
  
      if (!rootUSer) {
        throw new Error("User Not Registered"); 
      }
  
      // let date=Date.now();;
      // var seconds = parseInt(date / 1000);
  
      // if(seconds > verifyToken.exp ) {
      //     console.log("🚀 ~ file: router.js ~ line 80 ~ router.get ~ seconds", seconds)
      //     console.log("🚀 ~ file: router.js ~ line 80 ~ router.get ~ verifyToken.exp", verifyToken.exp)
      //     console.log("Inside flaurenn jjjjjjjjjjjjjjjjj")
      //     res.render('failure');
      //      return;
      //    }
      
     
  
      const result=await User.updateOne({_id:verifyToken._id},{$set:{
        verify:true
      }})

      console.log("🚀 ~ file: router.js ~ line 91 ~ router.get ~ result", result)
    
      res.render('success',{
        client:process.env.CLIENT_URL
    })
    }