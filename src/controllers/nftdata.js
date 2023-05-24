const NFT = require("../database/nftschema");
const Transaction = require("../database/transaction");
const CopyRight = require("../database/copyrightschema");
const User=require("../database/user")

exports.nftdata = async (req, res) => {

    let id = req.params.id;
    let {nftName,nftId,original}=req.query;
    let user = req?.session?.user;

    let matchQuery={owner_email:id,nftName:{$ne:nftName},status:{$ne:"notVerified"}};


    const result = await NFT.aggregate([
                    { "$match": matchQuery },
                    { "$sort" : { lastPrice : -1 } },
                    { "$limit": 4 }
    ])

    const user_profile = await User.findOne({email:id},{_id:1});

    const transactions =await Transaction.find({nftId:nftId}).sort({ createdDate: -1 }).limit(3);

    let copyright_status=false;

    if(user && original){
    copyright_status=await CopyRight.findOne({nftName:nftName,requesterId:user._id,status:{$ne:"completed"}
    // ,copyrightStatus:"copyright_allowed"
    },{},{ sort: { createdAt: -1 } });
    }

    res.send({ status: "success",nft:result,ownerId:user_profile._id,transactions:transactions,copyright_status});

}