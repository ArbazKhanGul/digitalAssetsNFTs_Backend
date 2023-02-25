const User = require('../database/user');
const fs = require('fs');
const path = require('path');

exports.profile=(req,res)=>{
  
    console.log("🚀 ~ file: profile.js ~ line 3 ~ req.user", req.user)
    res.status(200).send({
        message: "success",
        user:req.user
      });

    }



exports.profileUpdate=async (req,res)=>{

  let values=req.body;
  console.log("🚀 ~ file: profile.js:20 ~ exports.profileUpdate= ~ values", values)


   if(!(Object.keys(req.files).length === 0))
   {
    let allFiles=req.files;
    const oldPath = path.join(__dirname, "..","..", "images");

    for (var key in allFiles) {
      let imagePath = path.join(oldPath,req.user[key]);
      fs.unlinkSync(imagePath);
      values[key]=allFiles[key][0]?.filename;
    }
   }


  let response;
  if(!(Object.keys(values).length === 0))
   {
   response=await User.findByIdAndUpdate(req.user._id,values,{
    new:true,
    newValidator:true,
      runValidator:true
    })
   }

   req.session.user=response;
    res.status(200).send({
        message: "success",
        user:response
      });
}
