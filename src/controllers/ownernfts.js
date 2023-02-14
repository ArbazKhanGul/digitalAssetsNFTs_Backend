const NFT = require("../database/nftschema");
const User=require("../database/user")
exports.ownernfts = async (req, res) => {


    let id = req.params.id;
    let {nftName}=req.query;
    console.log("🚀 ~ file: ownernfts.js:8 ~ exports.ownernfts= ~ nftName", nftName)
    console.log("🚀 ~ file: ownernfts.js:7 ~ exports.ownernfts= ~ id", id)

    let matchQuery={owner_email:id,nftName:{$ne:nftName}};


    const result = await NFT.aggregate([
                    { "$match": matchQuery },
                    { "$sort" : { lastPrice : -1 } },
                    { "$limit": 4 }
    ])

    const user = await User.findOne({email:id},{_id:1});


    res.send({ status: "success",nft:result,ownerId:user._id});

}