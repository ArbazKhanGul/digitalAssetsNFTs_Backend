const NFT = require('../../database/nftschema')
const bnb_price=require("../../utils/price")
var AdminData = require('../../database/adminData');
const { ethers } = require("ethers");


exports.copycreationfee=async (req,res)=>{

    const size=req.body.size;
  const contentType=req.body.contentType;
  const hash=req.body.hash;
  console.log("🚀 ~ file: copy.js:12 ~ exports.copycreationfee= ~ hash:", hash)

 let estimated_price_inDollar=0;

 if(hash){
  const checkHash = await NFT.findOne({hash: hash})
  console.log("🚀 ~ file: copy.js:17 ~ exports.copycreationfee= ~ checkHash:", checkHash)
 if(checkHash){
  res.send({ status: "duplicate",result:checkHash})
   return;
 }
 }


 if(contentType!="image"){
  estimated_price_inDollar=await bnb_price(size,contentType);
 }

 const result = await AdminData.findOne({});
 const fee=ethers.utils.parseUnits(result.nftCreationFee.toString(), "ether");

 res.send({ status: "success",contentFee:estimated_price_inDollar,creationFee:fee})

}