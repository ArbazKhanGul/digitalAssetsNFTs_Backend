
const NFT = require('../database/nftschema');
const Nonce = require('../database/nonceschema');
const sign = require("../utils/sign")
const bnb_price = require("../utils/price")
const CopyRight=require("../database/copyrightschema")

exports.copycreationdifferent = async (req, res) => {

  const nftFrontend = req.body;
  console.log("🚀 ~ file: nftcreation.js:53 ~ exports.nftCreation= ~ nftFrontend:", nftFrontend)
  const user = req.user;


  let originalnft = await NFT.findOne({ nftName: nftFrontend.nftName, original: true });

  if (originalnft.owner_address == user.address) {


    const nft = new NFT({
      nftName: nftFrontend.nftName,
      original: false,
      creator_email: nftFrontend.creatorEmail,
      owner_email: user.email,
      creator_address: nftFrontend.creatorAddress,
      owner_address: user.address,
      contentURI: nftFrontend.contentURL,
      tokenURI: nftFrontend.metadataURL,
      contentType: nftFrontend.contentType,
      createdAt: nftFrontend.creationDate,
      originalTokenURI: nftFrontend.originalTokenURI
    })


    const saved_nft = await nft.save();


    let estimated_price_inDollar = 0;

    if (nftFrontend.nftContentType != "image") {
      estimated_price_inDollar = await bnb_price(nftFrontend.size, nftFrontend?.contentType);
    }

    const nextCount = await Nonce.getNextCount();
    console.log("🚀 ~ file: copycreation.js:32 ~ exports.copycreation= ~ nextCount:", nextCount)

    const signature = await sign(nftFrontend.tokenId + "_" + nextCount);


    res.send({
      status: "success", nonce: nextCount, signature
      , price: estimated_price_inDollar
    })
  }
  else {

    let copyrightRequest = await CopyRight.findOne({ requesterId: user._id, status: "accept",nftName:nftFrontend.nftName });

    if (copyrightRequest) {

      const nft = new NFT({
        nftName: nftFrontend.nftName,
        original: false,
        creator_email: nftFrontend.creatorEmail,
        owner_email: user.email,
        creator_address: nftFrontend.creatorAddress,
        owner_address: user.address,
        contentURI: nftFrontend.contentURL,
        tokenURI: nftFrontend.metadataURL,
        contentType: nftFrontend.contentType,
        createdAt: nftFrontend.creationDate,
        originalTokenURI: nftFrontend.originalTokenURI
      })


      const saved_nft = await nft.save();
      
      await CopyRight.findByIdAndUpdate(copyrightRequest._id,{
        $set:{tokenURI:nftFrontend.metadataURL}
      })
      
      let estimated_price_inDollar = 0;

      if (nftFrontend.nftContentType != "image") {
        estimated_price_inDollar = await bnb_price(nftFrontend.size, nftFrontend?.contentType);
      }

      const nextCount = await Nonce.getNextCount();
      console.log("🚀 ~ file: copycreation.js:32 ~ exports.copycreation= ~ nextCount:", nextCount)

      const signature = await sign(nftFrontend.tokenId + "_" + nextCount);


      res.send({
        status: "success", nonce: nextCount, signature
        , price: estimated_price_inDollar+copyrightRequest.offeredMoney
      })
    }
    else {
      throw new Error("Invalid request");
    }
  }
}









