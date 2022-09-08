const getNonce=require("../utils/getNonce")
const User = require('../database/user');
const web3=require('web3')
const sendEmail=require('../utils/sendEmail');
exports.userRegisteration=async (req, res) => {

  
    const {collectionName,authorName,email,walletAddress,description} = req.body;
    const {profile,cover}=req.files;

    console.log("inside registeration");

    if (!web3.utils.isAddress(walletAddress)){
        throw new Error("Invalid wallet address")
    }

           let profileUrl=profile[0]?.filename;
           let coverUrl=cover[0]?.filename;
              


      const new_user = new User({
        address: web3.utils.toChecksumAddress(walletAddress),
        collectionName,
        authorName,
        profile:profileUrl,
        cover:coverUrl,
        email,
        description:description,
        nonce: await getNonce(),
      });
      // console.log("🚀 ~ file: router.js ~ line 46 ~ router.post ~ new_user", new_user)
    

      const saved_user = await new_user.save();
      console.log("🚀 ~ file: router.js ~ line 50 ~ router.post ~ saved_user", saved_user)
      sendEmail(saved_user);



    res.status(200).send({
      message: "success",
        })
  }