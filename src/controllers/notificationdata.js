var Notification = require('../database/notificationSchema')

exports.deletenotification= async (req, res) => {
    let {notification_id} = req?.params;
    let user=req.user;
    await Notification.deleteOne({_id:notification_id,notification_for:user.address});

    const notifications = await Notification.aggregate([
        { "$sort" : { createdAt : -1 } },
        { "$limit": 1 }
])

    res.send({status:"success",notifications});

}


exports.unreadnotification= async (req, res) => {
    let user=req.user;
   
    let count = await Notification.aggregate([
                 { "$match": {status:false,notification_for:user.address} },
                    {
                        "$count": "count"
                    }
])

    if(count.length>0)
    {
        count=count[0].count;
    }
    else{
        count=0;
    }
    
    res.send({status:"success",count});

}