const NFT = require('../../database/nftschema')
const bnb_price=require("../../utils/price")
var AdminData = require('../../database/adminData');
const { ethers } = require("ethers");


exports.nftVerification = async (req, res, next) => {
  try {
      const { nftName, hash, size, contentType } = req.body;

      const checkName = await NFT.findOne({ nftName: nftName });

      if (checkName) {
          if (checkName.status === "notVerified") {
              let date = new Date();
              let d1 = date.getTime();
              let d2 = checkName.createdAt.getTime() + 600000;

              if (d2 > d1) {
                  res.send({ status: "timeNotPass", time: d2 - d1, type: "name" });
                  return;
              } else {
                  await NFT.deleteOne({ _id: checkName._id });
              }
          } else {
              res.send({ status: "duplicate", result: checkName, type: "name" });
              return;
          }
      }

      const checkHash = await NFT.findOne({ hash: hash });
      if (checkHash) {
          res.send({ status: "duplicate", result: checkHash, type: "content" });
          return;
      }

      let estimated_price_inDollar = 0;
      if (contentType !== "image") {
          estimated_price_inDollar = await bnb_price(size, contentType);
      }

      const result = await AdminData.findOne({});
      const fee = ethers.utils.parseUnits(result.nftCreationFee.toString(), "ether");

      res.send({ status: "success", contentFee: estimated_price_inDollar, creationFee: fee });
  } catch (error) {
      console.error("🚀 ~ exports.nftVerification= ~ error:", error);

      // Send error response with appropriate status code
      res.status(500).send({ status: "error", message: error.message });

      // Alternatively, if you want to pass the error to the next middleware
      // next(error);
  }
};


exports.nftCreation = async (req, res) => {
  const nftFrontend = req.body;
  const user = req.user;

  const nft = new NFT({
    nftName: nftFrontend.nftName,
    creator_email: user.email,
    owner_email: user.email,
    creator_address: user.address,
    owner_address: user.address,
    contentURI:nftFrontend.contentURL,
    tokenURI:nftFrontend.metadataURL,
    contentType:nftFrontend.contentType,
    createdAt:nftFrontend.creationDate,
    language:nftFrontend.language,
    hash:nftFrontend.hash
  })
  await nft.save();

  res.send({ status: "success"})
}



exports.nftCreationFee = async (req, res) => {
  const result = await AdminData.findOne({});
  let user=req.user;
  if(result){
      res.send({ status: "success",user,nftCreationFee:result.nftCreationFee});
      return;
  }
  else{
      throw new Error("Something went wrong");
  }
}



