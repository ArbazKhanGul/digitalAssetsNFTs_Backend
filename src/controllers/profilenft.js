const NFT = require("../database/nftschema");

exports.profilenft = async (req, res) => {


    let id = req.params.id;
    let {skip,type,nftName}=req.query;
    console.log("🚀 ~ file: profilenft.js:8 ~ exports.profilenft= ~ type", type)
    console.log("🚀 ~ file: profilenft.js:8 ~ exports.profilenft= ~ skip", skip)
    console.log("🚀 ~ file: collection.js ~ line 6 ~ exports.collection= ~ id", id)

    let matchQuery={status:{$ne:"notVerified"}};

  if(type==="Owned") {matchQuery.owner_email = id}
  if(type==="Created") {matchQuery.creator_email = id}
  if(nftName) {matchQuery.nftName = nftName.toLowerCase()}
  if(type==="both") {matchQuery.owner_email = id;matchQuery.creator_email = id}






    let skipnft = skip * 8;

    const result = await NFT.aggregate([
        {
            "$facet": {
                "totalData": [
                    { "$match": matchQuery },
                    { "$sort" : { lastPrice : -1 } },
                    { "$skip": skipnft },
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
    // console.log("🚀 ~ file: nft.js:56 ~ exports.nft= ~ nft", nft)
    let count = result[0]?.totalCount[0]?.count ? result[0]?.totalCount[0]?.count : 0;
    console.log("🚀 ~ file: profilenft.js:54 ~ exports.profilenft= ~ count", count)


    res.send({ status: "success",nft, count})

}