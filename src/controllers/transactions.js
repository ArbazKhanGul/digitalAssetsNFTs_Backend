const Transaction = require("../database/transaction");

exports.transactions = async (req, res) => {

    let id = req.params.id;
    let query = req.query


    let matchQuery={};
  
  if(query['nftType']=="original"){matchQuery.original = true}
  if(query['nftType']=="copy"){matchQuery.original = false}


  if(query['transactionType']=="sell"){matchQuery.type="sell"}
  if(query['transactionType']=="create"){matchQuery.type = "create"}


  if(query['nftName']!==undefined) {matchQuery.nftName = query['nftName']}
  if(query['ownerName']!==undefined) {matchQuery.ownerName = query['ownerName']}
  if(query['buyerName']!==undefined) {matchQuery.buyerName = query['buyerName']}
  if(query['tokenId']!==undefined) {matchQuery.tokenId = parseInt(query['tokenId'])}



  if(query['minimumPrice']!==undefined && query['maximumPrice']!==undefined) {matchQuery.price = {$gte: parseFloat(query['minimumPrice']),$lte:parseFloat(query['maximumPrice'])} }
  else if(query['maximumPrice']!==undefined ) {matchQuery.price = {$lte: parseFloat(query['maximumPrice']) }}
  else if(query['minimumPrice']!==undefined ) {matchQuery.price = {$gte: parseFloat(query['minimumPrice']) }}




  console.log("🚀 ~ file: transactions.js:10 ~ exports.transactions= ~ matchQuery:", matchQuery)


    let skip = (id - 1) * 10;

    const result = await Transaction.aggregate([
        {
            "$facet": {
                "totalData": [
                    { "$match": matchQuery },
                    { "$sort" : { createdAt : -1 } },
                    { "$skip": skip },
                    { "$limit": 10 }
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



    let transactions = result[0]?.totalData;  
    // console.log("🚀 ~ file: nfts.js:56 ~ exports.transactions= ~ transactions", transactions)
    let count = result[0]?.totalCount[0]?.count ? result[0]?.totalCount[0]?.count : 0;


    res.send({ status: "success",transactions, count})
}