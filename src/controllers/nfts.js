const NFT = require("../database/nftschema");

exports.nft = async (req, res) => {


    let id = req.params.id;
    let query = req.query


    let matchQuery={status:{$ne:"notVerified"}};
    
  if(query['nftType']=="original"){matchQuery.original = true}
  if(query['nftType']=="copy"){matchQuery.original = false}
  if(query['nftName']!==undefined) {matchQuery.nftName = query['nftName']}
  if(query['ownerEmail']!==undefined) {matchQuery.owner_email = query['ownerEmail']}
  if(query['creatorEmail']!==undefined) {matchQuery.creator_email = query['creatorEmail']}
  if(query['ownerWalletAddress']!==undefined) {matchQuery.owner_address= query['ownerWalletAddress']}
  if(query['creatorWalletAddress']!==undefined) {matchQuery.creator_address= query['creatorWalletAddress']}



  if(query['minimumPrice']!==undefined && query['maximumPrice']!==undefined) {matchQuery.price = {$gte: parseFloat(query['minimumPrice']),$lte:parseFloat(query['maximumPrice'])} }
  else if(query['maximumPrice']!==undefined ) {matchQuery.price = {$lte: parseFloat(query['maximumPrice']) }}
  else if(query['minimumPrice']!==undefined ) {matchQuery.price = {$gte: parseFloat(query['minimumPrice']) }}





    let skip = (id - 1) * 8;

    const result = await NFT.aggregate([
        {
            "$facet": {
                "totalData": [
                    { "$match": matchQuery },
                    { "$sort" : { lastPrice : -1 } },
                    { "$skip": skip },
                    { "$limit": 8 }
                ],
                "totalCount": [
                    { "$match": matchQuery },
                    {
                        "$count": "count"
                    }
                ]
            }
        }
    ])



    let nft = result[0]?.totalData;  
    console.log("🚀 ~ file: nfts.js:56 ~ exports.nft= ~ nft", nft)
    let count = result[0]?.totalCount[0]?.count ? result[0]?.totalCount[0]?.count : 0;


    res.send({ status: "success",nft, count})

}