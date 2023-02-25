var Notification = require('../database/notificationSchema')
// import { ethers } from "ethers";

exports.notification = async (req, res) => {
let {skip,state}=req.query;
let user=req.user;
let obj={notification_for:user.address};


if(state=="false"){
        obj.status=false
}


// let notifications=await Notification.find(obj).skip(skip).limit(12);

const notifications = await Notification.aggregate([
                    { "$match": obj },
                    { "$sort" : { createdAt : -1 } },
                    { "$skip": parseInt(skip) },
                    { "$limit": 12 }
    ])
    


res.send({ status: "success",notifications});

}