const CopyRight  = require('../database/copyrightschema');
const Notification = require("../database/notificationSchema");

exports.copyrightdelete = async (req, res) => {
    let {delete_id} = req?.params;
    console.log("🚀 ~ file: deletecopyright.js:5 ~ exports.copyrightdelete ~ delete_id:", delete_id)

    let user = req?.session?.user

    const result = await CopyRight.deleteOne({ _id: delete_id,
        requesterId:user._id})

    if(result.deletedCount===1){
      let res= await Notification.deleteMany({ copyrightId: delete_id})
        console.log("🚀 ~ file: deletecopyright.js:15 ~ exports.copyrightdelete ~ res:", res)
        }

    console.log("🚀 ~ file: copyrightaction.js:14 ~ exports.copyrightaction= ~ result:", result)

    if(result.deletedCount==1){
        res.send({ status: "success"});
        return;
    }
    else{
        throw new Error("Something went wrong");
    }
}