const NFT = require("../database/nftschema");
const Transaction = require("../database/transaction");
const User=require("../database/user")
exports.nftdata = async (req, res) => {

    let id = req.params.id;
    let {nftName,nftId}=req.query;
    console.log("🚀 ~ file: nftdata.js:8 ~ exports.nftdata= ~ nftId", nftId)

    let matchQuery={owner_email:id,nftName:{$ne:nftName},status:{$ne:"notVerified"}};


    const result = await NFT.aggregate([
                    { "$match": matchQuery },
                    { "$sort" : { lastPrice : -1 } },
                    { "$limit": 4 }
    ])

    const user = await User.findOne({email:id},{_id:1});

    const transactions =await Transaction.find({nftId:nftId}).limit(3);
    console.log("🚀 ~ file: nftdata.js:22 ~ exports.nftdata= ~ transactions", transactions)


    res.send({ status: "success",nft:result,ownerId:user._id,transactions:transactions});

}