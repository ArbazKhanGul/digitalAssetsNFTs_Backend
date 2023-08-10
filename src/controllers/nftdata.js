const NFT = require("../database/nftschema");
const Transaction = require("../database/transaction");
const CopyRight = require("../database/copyrightschema");
const User = require("../database/user")

exports.nftdata = async (req, res) => {

    let id = req.params.id;
    let { nftName, nftId, original } = req.query;
    let user = req?.session?.user;

    let matchQuery = { owner_email: id, nftName: { $ne: nftName }, status: { $ne: "notVerified" } };

    let copies;
    let count=0;

    const result = await NFT.aggregate([
        { "$match": matchQuery },
        { "$sort": { lastPrice: -1 } },
        { "$limit": 4 }
    ])

    if (original=="true") {

        let matchQueryCopy = { nftName: nftName, original: false, status: { $ne: "notVerified" } };
        copies = await NFT.aggregate([
            {
                "$facet": {
                    "copies": [
                        { "$match": matchQueryCopy },
                        { "$sort": { lastPrice: -1 } },
                        { "$limit": 4 }]
                    ,
                    "TotalCopies": [
                        { "$match": matchQueryCopy },
                        {
                            "$count": "count"
                        }
                    ]
                }
            }
        ])

         count = copies[0]?.TotalCopies[0]?.count ? copies[0]?.TotalCopies[0]?.count : 0;
         copies=copies[0]?.copies;
        console.log("🚀 ~ file: nftdata.js:39 ~ exports.nftdata= ~ count:", count)
        console.log("🚀 ~ file: nftdata.js:36 ~ exports.nftdata= ~ copies:", copies)
    }

    const user_profile = await User.findOne({ email: id }, { _id: 1 });

    const transactions = await Transaction.find({ nftId: nftId }).sort({ createdDate: -1 }).limit(3);

    let copyright_status = false;

    if (user && original=="true") {
        copyright_status = await CopyRight.findOne({
            nftName: nftName, requesterId: user._id, status: { $ne: "completed" }
            // ,copyrightStatus:"copyright_allowed"
        }, {}, { sort: { createdAt: -1 } });
    }
res.send({ status: "success", nft: result, ownerId: user_profile._id, transactions: transactions, copyright_status ,copies:copies,copiesCount:count});

}