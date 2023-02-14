var Notification = require('../database/notificationSchema')

exports.individualnotification= async (req, res) => {
    let {notification_id} = req?.params;
    let {status}=req?.query;


    let user= req?.session?.user

   if(status=="false"){

   const reponse= await Notification.updateOne({_id:notification_id},{
        $set: {
            status: true
        }
    })
   console.log("🚀 ~ file: individualnotification.js:18 ~ exports.individualnotification= ~ reponse", reponse)
   }

    let result= await Notification.findOne({_id:notification_id});

    if(result){
    res.send({status:"success",notification:result,user:user});
    return;
    }
    else{
        res.send({status:"notfound"});
    }

}