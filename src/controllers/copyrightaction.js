const CopyRight  = require('../database/copyrightschema');
const Notification = require("../database/notificationSchema");
const User=require("../database/user")


exports.copyrightaction = async (req, res) => {
    let {id,comment,status} = req?.body;
    console.log("🚀 ~ file: copyrightaction.js:6 ~ exports.copyrightaction= ~ status:", status)
    console.log("🚀 ~ file: copyrightaction.js:6 ~ exports.copyrightaction= ~ id:", id)
    console.log("🚀 ~ file: copyrightaction.js:6 ~ exports.copyrightaction= ~ comment:", comment)

    let user = req?.session?.user

    const result = await CopyRight.findOneAndUpdate({ _id: id,ownerId:user._id}, {
        $set: {
            status: status, comments: comment,actionUserName:user.authorName,actionUserId:user._id,actionUserProfile:user.profile
        }
    } ,{ new: true, runValidators: true })
    console.log("🚀 ~ file: copyrightaction.js:18 ~ exports.copyrightaction= ~ result:", result)

          let requester=await User.findById(result.requesterId);
          console.log("🚀 ~ file: copyrightaction.js:21 ~ exports.copyrightaction= ~ requester:", requester)


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

    console.log("🚀 ~ file: copyrightaction.js:14 ~ exports.copyrightaction= ~ result:", result)

    if(result){
        res.send({ status: "success"});
        return;
    }
    else{
        throw new Error("Something went wrong");
    }
}