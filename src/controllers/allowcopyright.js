var NFT = require('../database/nftschema');

exports.allowcopyright = async (req, res) => {
    let {id,price} = req?.body;
    console.log("🚀 ~ file: allowcopyright.js:5 ~ exports.allowcopyright= ~ price:", price)
    console.log("🚀 ~ file: cancelrequest.js:6 ~ exports.copyrightaction= ~ id:", id)


    let user = req?.session?.user

    
    const result = await NFT.updateOne({ tokenURI: id,ownerId:user._id},{
        $set: {
            copyrightStatus: "allowed", copyrightPrice: price
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