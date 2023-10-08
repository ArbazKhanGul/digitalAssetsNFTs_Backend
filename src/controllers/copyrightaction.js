const CopyRight  = require('../database/copyrightschema');
const Notification = require("../database/notificationSchema");
const User=require("../database/user")


exports.copyrightaction = async (req, res) => {
    let {id,comment,status,signature} = req?.body;

    let user = req?.session?.user

    const result = await CopyRight.findOneAndUpdate({ _id: id,ownerId:user._id}, {
        $set: {
            status: status, comments: comment,actionUserName:user.authorName,actionUserId:user._id,actionUserProfile:user.profile,
            signature
        }
    } ,{ new: true, runValidators: true })


          let requester=await User.findById(result.requesterId);


    const notification=new Notification({
        notification_for:requester.address,
        nftName:result.nftName,
        nftId:result.nftId,
        owner_profile:user.profile,
        ownerId:user._id,
        type:`action_copyright_${status}`,
        price:result.offeredMoney,
        transfer_to:user.authorName,
        copyrightId:result._id
      })

      await notification.save();

    if(result){
        res.send({ status: "success"});
        return;
    }
    else{
        throw new Error("Something went wrong");
    }
    
}