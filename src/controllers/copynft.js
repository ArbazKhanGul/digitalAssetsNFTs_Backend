const NFT = require('../database/nftschema');
const Copyright = require('../database/copyrightschema')
exports.copynft = async (req, res) => {

    let { nft_id } = req?.params;
    let user = req.session.user;

    console.log("🚀 ~ file: copynft.js:7 ~ exports.copynft= ~ id:", nft_id)

    let nftresult = await NFT.aggregate([
        { "$match": { tokenURI: nft_id, status: { $ne: "notVerified" } } },
        { "$project": { owner_address: 1, creator_address: 1, tokenURI: 1, tokenId: 1, nftName: 1, copyrightStatus: "allowed",contentType:1} },
        {
            "$lookup": {
                from: "signupforms",
                localField: "owner_address",
                foreignField: "address",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            authorName: 1,
                            profile: 1,
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            "$lookup": {
                from: "signupforms",
                localField: "creator_address",
                foreignField: "address",
                as: "creator",
                pipeline: [
                    {
                        $project: {
                            authorName: 1,
                            profile: 1,
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $unwind: "$creator"
        },
    ])

    console.log("🚀 ~ file: copynft.js:60 ~ exports.copynft= ~ nftresult:", nftresult)

    if (nftresult.length > 0) {

        nftresult = nftresult[0];

        if (nftresult.owner_address == user.address) {
            res.send({ status: "success", nftData: nftresult, user })
             return;
        }
        else{
             let copyrightRequest=await Copyright.findOne({requesterId:user._id,status:"accept"});
            if(copyrightRequest)
             {
                res.send({ status: "success", nftData: nftresult, user })
                return;
             }
        }
    }

        throw new Error("Route not found");
}