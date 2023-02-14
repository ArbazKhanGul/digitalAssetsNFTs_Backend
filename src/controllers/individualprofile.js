var User = require('../database/user')

exports.individualprofile= async (req, res) => {
    console.log("iunside  afa fa")
    let {profile_id} = req?.params;
    let user= req?.session?.user


    let result= await User.findOne({_id:profile_id,verify:true});
    console.log("🚀 ~ file: individualprofile.js:9 ~ exports.individualprofile= ~ result", result)


    if(result){
    res.send({status:"success",profile:result,user:user});
    return;
    }
    else{
        res.send({status:"notfound"});
    }

}