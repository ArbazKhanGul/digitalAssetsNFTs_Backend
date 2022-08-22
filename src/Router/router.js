const express = require("express");
const router = express.Router();
const store=require("../middleware/multer");
const getNonce=require("../utils/getNonce")
const User = require('../database/user');
const web3 = require('web3');
const sendEmail = require('../utils/sendEmail')
const jwt = require("jsonwebtoken");


const multiupload=store.fields([{name: 'profile',maxCount:1},{name: 'cover',maxCount:1}]);

router.post("/register",multiupload,async (req, res) => {

  
    const {collectionName,authorName,email,walletAddress} = req.body;
    const {profile,cover}=req.files;


    if (!web3.utils.isAddress(walletAddress)){
        throw new Error("Invalid wallet address")
    }

           let profileUrl=profile[0]?.filename;
           let coverUrl=cover[0]?.filename;
              


    //  console.log("🚀 ~ file: router.js ~ line 21 ~ router.post ~ coverUrl", coverUrl)
    //  console.log("🚀 ~ file: router.js ~ line 20 ~ router.post ~ profileurl", profileUrl)
    //  console.log("🚀 ~ file: router.js ~ line 17 ~ router.post ~ walletaddress", walletAddress)
    //  console.log("🚀 ~ file: router.js ~ line 18 ~ router.post ~ email", email)
    //  console.log("🚀 ~ file: router.js ~ line 18 ~ router.post ~ authorName", authorName)
    //  console.log("🚀 ~ file: router.js ~ line 18 ~ router.post ~ collectionName", collectionName)
  



      const new_user = new User({
        address: web3.utils.toChecksumAddress(walletAddress),
        collectionName,
        authorName,
        profile:profileUrl,
        cover:coverUrl,
        email,
        nonce: await getNonce(),
      });
      // console.log("🚀 ~ file: router.js ~ line 46 ~ router.post ~ new_user", new_user)
    

      const saved_user = await new_user.save();
      console.log("🚀 ~ file: router.js ~ line 50 ~ router.post ~ saved_user", saved_user)
      sendEmail(saved_user);



    res.status(200).send({
      message: "success",
        })
  });



  router.get('/verify/:token',async (req,res)=>{
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
  
    res.render('success')
  })

  module.exports = router;