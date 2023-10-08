const User = require("../../database/user");
const ethers = require('ethers');

exports.profileInfo = async (req, res) => {

    let {address} = req.query;
      address = ethers.utils.getAddress(address.toString());
 
    let profile =await User.findOne({address: address});
   
    if(profile){
        res.status(200).json({profile})
    }
    else{
        throw new Error("Profile Not Found")
    }
}