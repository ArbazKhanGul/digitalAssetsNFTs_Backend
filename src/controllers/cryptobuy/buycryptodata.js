var AdminData = require('../../database/adminData');

exports.buycryptodata = async (req, res) => {
  

    
    const result = await AdminData.findOne({},{platformBnbIncrement:1,maximumTransfer:1});
    console.log("🚀 ~ file: buycryptodata.js:7 ~ exports.buyingoptions= ~ result:", result)

    if(result){
        res.send({ status: "success",user:req.user,data:result});
        return;
    }
    else{
        throw new Error("Data not found");
    }
}