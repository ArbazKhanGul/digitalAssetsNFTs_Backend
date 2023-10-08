const NFT = require('../../database/nftschema')
const bnb_price=require("../../utils/price")
var AdminData = require('../../database/adminData');
const { ethers } = require("ethers");


exports.copycreationfee=async (req,res)=>{

    const size=req.body.size;
  const contentType=req.body.contentType;

 let estimated_price_inDollar=0;
 if(contentType!="image"){
  estimated_price_inDollar=await bnb_price(size,contentType);
 }

 const result = await AdminData.findOne({});
 const fee=ethers.utils.parseUnits(result.nftCreationFee.toString(), "ether");

 res.send({ status: "success",contentFee:estimated_price_inDollar,creationFee:fee})

}