var NFT = require('../database/nftschema')
// import { ethers } from "ethers";

exports.nftSelling = async (req, res) => {



    // let data = req.body;
    // console.log("🚀 ~ file: nftselling.js:5 ~ exports.nftSelling= ~ data", data)

    // let result = await NFT.findOne({ hash: data?.nftHash, status: "verified" });


    // let wallet=new ethers.Wallet(process.env.PRIVATE_KEY)
    // let signMessage = await wallet.signMessage(message );

    if (result) {
        res.send({ status: "success" });
    }
    else {
        throw new Error("NFT status is not valid for selling")
    }
}