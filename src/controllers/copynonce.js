const NFT=require("../database/nftschema");

exports.copynonce=async (req,res)=>{
    
    let id=req.params.id;
    let result =await NFT.findOneAndUpdate({tokenURI:id}, { $inc: { copyNonce: 1 } }, { new: true,projection: { copyNonce: 1 } });
    console.log("🚀 ~ file: copynonce.js:7 ~ exports.copynonce= ~ result:", result)
     
    if(result){
        res.send({status:"success",nonce:result.copyNonce});
     }
     else{
        throw new Error("NFT not found");
     }
}