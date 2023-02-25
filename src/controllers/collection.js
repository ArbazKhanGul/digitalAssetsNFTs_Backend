const User = require("../database/user");

exports.collection = async (req, res) => {

    
    let id = req.params.id;
    let query = req.query
  
    let matchQuery={verify: { $ne: false }};
  if(query['authorName']!==undefined) {matchQuery.authorName = query['authorName']}
  if(query['email']!==undefined) {matchQuery.email = query['email']}
  if(query['walletAddress']!==undefined) {matchQuery.walletAddress = query['walletAddress']}

  
  if(query['minimumVolume']!==undefined && query['maximumVolume']!==undefined) {matchQuery.volume = {$gte: parseFloat(query['minimumVolume']),$lte:parseFloat(query['maximumVolume'])} }
  else if(query['maximumVolume']!==undefined ) {matchQuery.volume = {$lte: parseFloat(query['maximumVolume']) }}
  else if(query['minimumVolume']!==undefined ) {matchQuery.volume = {$gte: parseFloat(query['minimumVolume']) }}
  

  if(query['minimumFloor']!==undefined && query['maximumFloor']!==undefined) {matchQuery.floorPrice = {$gte: parseFloat(query['minimumFloor']),$lte:parseFloat(query['maximumFloor'])} }
  else if(query['maximumFloor']!==undefined ) {matchQuery.floorPrice = {$lte: parseFloat(query['maximumFloor']) }}
  else if(query['minimumFloor']!==undefined ) {matchQuery.floorPrice = {$gte: parseFloat(query['minimumFloor']) }}



    let skip = (id - 1) * 9;

    const result = await User.aggregate([
        {
            "$facet": {
                "totalData": [
                    { "$match": matchQuery },
                    { "$sort" : { volume : -1 } },
                    { "$skip": skip },
                    { "$limit": 9 }
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


    let user = result[0]?.totalData;

    // console.log("🚀 ~ file: collection.js ~ line 34 ~ exports.collection= ~ result[0]", result[0])  
    let count = result[0]?.totalCount[0]?.count ? result[0]?.totalCount[0]?.count : 0;

    res.send({ status: "success", user, count })
}