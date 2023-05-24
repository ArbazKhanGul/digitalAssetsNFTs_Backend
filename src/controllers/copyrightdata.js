const CopyRight  = require('../database/copyrightschema');
var NFT = require('../database/nftschema')

exports.copyrightdata = async (req, res) => {
    let { copyright_id } = req?.params;
    let user = req?.session?.user
    console.log("🚀 ~ file: copyrightdata.js:5 ~ exports.copyrightdata= ~ copyright_id:", copyright_id)
   
    let result = await CopyRight.findOne({ _id:copyright_id,
         status: { $ne: "reject" } },{
    });
    
    console.log("🚀 ~ file: individualnft.js:15 ~ exports.individualnft= ~ result", result)

 
    if (result) {
        res.send({ status: "success", data: result, user: user });
        return;
    }
    else {
        res.send({ status: "notfound" });
    }

}