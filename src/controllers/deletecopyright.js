const CopyRight  = require('../database/copyrightschema');
const Notification = require("../database/notificationSchema");
const User=require("../database/user");

exports.copyrightdelete = async (req, res) => {
    let {delete_id} = req?.params;
    console.log("🚀 ~ file: deletecopyright.js:5 ~ exports.copyrightdelete ~ delete_id:", delete_id)

    let user = req?.session?.user

    const result = await CopyRight.findOneAndDelete({ _id: delete_id,
        requesterId:user._id})

    console.log("🚀 ~ file: deletecopyright.js:12 ~ exports.copyrightdelete ~ result:", result)

    if(result){
      let res= await Notification.deleteMany({ copyrightId: delete_id})

      if(result.status=="accept"){
        let ownerAddress=await User.findById(result.actionUserId,{address:1});

        const notification=new Notification({
        notification_for:ownerAddress.address,
        nftName:result.nftName,
        nftId:result.nftId,
        owner_profile:user.profile,
        ownerId:user._id,
        type:`delete_copyright`,
        price:0,
        transfer_to:user.authorName,
      })
      await notification.save();

    }

    }

 
    if(result){
        res.send({ status: "success"});
        return;
    }
    else{
        throw new Error("Something went wrong");
    }
}