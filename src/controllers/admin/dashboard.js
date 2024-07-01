var AdminData = require('../../database/adminData');


exports.dashboardData=async (req, res) => { 
    let user= req.user;

    const result = await AdminData.findOne({});

    res.send({status :"success",user,creationFee:result.nftCreationFee})
  }


exports.dashboardFeeUpdate=async (req, res) => {

    const { newCreationFee } = req.body;

    const updateFee = await AdminData.findOneAndUpdate(
      {},
      { $set: { nftCreationFee: newCreationFee } },
      { new: true }
    );


    if (!updateFee) { 
      throw new Error("Some error in updating fee");
    }


    return res.status(200).json({status :"success"});

  }