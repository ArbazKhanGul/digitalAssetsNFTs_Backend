var NFT = require('../database/nftschema');

exports.cancelcopyright = async (req, res) => {
    let {id} = req?.body;
    console.log("🚀 ~ file: cancelrequest.js:6 ~ exports.copyrightaction= ~ id:", id)


    let user = req?.session?.user

    
    const result = await NFT.updateOne({ tokenURI: id,owner_address:user.address},{
        $set: {
            copyrightStatus: "notallowed", copyrightPrice: 0
        }
    })

    console.log("🚀 ~ file: copyrightaction.js:14 ~ exports.copyrightaction= ~ result:", result)

    if(result){
        res.send({ status: "success"});
        return;
    }
    else{
        throw new Error("Something went wrong");
    }
}