var AdminData = require('../database/adminData');

exports.buyingoptions = async (req, res) => {
    let {platformBnbIncrement,maximumTransfer} = req?.body;
    let insert={};
    if(platformBnbIncrement){
        insert.platformBnbIncrement=platformBnbIncrement
    }
    if(maximumTransfer){
        insert.maximumTransfer=maximumTransfer;
    }

    const result = await AdminData.findOneAndUpdate({},insert,{new:true});

    if(result){
        res.send({ status: "success"});
        return;
    }
    else{
        throw new Error("Something went wrong");
    }
}