const NFT = require("../database/nftschema");
const User = require("../database/user");

exports.homepagedata = async (req, res) => {

    let matchQueryProfile={verify:true};
    let matchQueryNft={status:{$ne:"notVerified"}};


    const profiles = await User.aggregate([
                    { "$match": matchQueryProfile },
                    {"$project": {
                        "authorName": 1,
                        "profile": 1,
                        "volume": 1,
                        "itemsBuy":1,
                        "itemsSell":1,
                        "itemsCreated":1
                      }},
                      { "$sort" : { volume : -1 } },
                      { "$limit": 9 }
    ])

    const nfts = await NFT.aggregate([
        { "$match": matchQueryNft },
        { "$sort" : { lastPrice : -1 } },
        {"$project": {
            "nftName": 1,
            "creator_email": 1,
            "owner_email": 1,
            "createdAt":1,
            "price":1,
            "title":1,
            "tokenURI":1
          }
        },
          { "$limit": 8 }
])

    res.send({ status: "success",profiles,nfts})
}