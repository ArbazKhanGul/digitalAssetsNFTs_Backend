const CopyRight = require('../database/copyrightschema');

exports.copyrightrequests = async (req, res) => {

    let { nftName } = req?.params;
    let { skip, requester,status } = req?.query;
    console.log("🚀 ~ file: copyrightrequests.js:7 ~ exports.copyrightrequests= ~ status:", status)

    let user = req?.session?.user;

    let obj = { nftName: nftName, ownerId: user?._id };

    if(status!="all"){
        obj.status=status;
    }

    if (requester) {
        const nameRegex = new RegExp('^' + requester);
        obj.requestorName = { $regex: nameRegex };
    }
    // let result = await CopyRight.find({ nftName:nftName,ownerId:user?._id
    //     //  status: { $ne: "notVerified" } },
    // },{
    // }).skip().limit(10);

    const result = await CopyRight.aggregate([
        { "$match": obj },
        { "$sort": { createdAt: -1 } },
        { "$skip": parseInt(skip) },
        { "$limit": 10 }
    ])

    // console.log("🚀 ~ file: copyrightrequests.js:12 ~ exports.copyrightrequests= ~ result:", result)


    res.send({ status: "success", data: result });

}