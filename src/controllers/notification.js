var Notification = require('../database/notificationSchema')
// import { ethers } from "ethers";

exports.notification = async (req, res) => {
let {skip}=req.query;
let user=req.user;

let notifications=await Notification.find({notification_for:user.address}).skip(skip).limit(12);


        res.send({ status: "success",notifications});
}