var NFT = require('../database/nftschema')

exports.individualnft= async (req, res) => {
    let {nft_id} = req?.params;
    let user= req?.session?.user
    console.log("🚀 ~ file: individualnft.js:4 ~ exports.individualnft= ~ user", user)
    console.log("🚀 ~ file: individualnft.js:3 ~ exports.collection= ~ nft_id", nft_id)
    let result= await NFT.findOne({hash:nft_id,status:{$ne:"notVerified"}});

    console.log("🚀 ~ file: individualnft.js:10 ~ exports.individualnft= ~ result", result)

    if(result){
    res.send({status:"success",nft:result,user:user});
    return;
    }
    else{
        res.send({status:"notfound"});
    }

}