var AdminData = require('../database/adminData');

exports.adminbuydata = async (req, res) => {


    const result = await AdminData.findOne({});

    if(result){
        res.send({ status: "success",user:req.user, data:result.nftCreationFee});
        return;
    }
    else{
        throw new Error("Something went wrong");
    }
}