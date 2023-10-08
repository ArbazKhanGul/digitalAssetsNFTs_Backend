const User= require('../database/user');
var CopyRight = require('../database/copyrightschema');
const NFT= require('../database/nftschema');
const Notification = require("../database/notificationSchema");
const Nonce = require('../database/nonceschema');

exports.copyright = async (req, res) => {

  let { offeredMoney,nftName,ownerId} = req?.body;


    let user = req?.session?.user
    let nftOwner = await User.findOne({ _id:ownerId});

    let nft =  await NFT.findOne({ nftName: nftName, status: { $ne: "notVerified" } }, {
      tokenURI:1,tokenId:1
  });

  if(!nft || !nftOwner){
    throw new Error("NFT not found")
  }

  const nextCount = await Nonce.getNextCount();

    const copyright = new CopyRight({
        nftName: nftName,
        nftId:nft.tokenURI,
        tokenId:nft.tokenId,
        offeredMoney:offeredMoney,
        requestorAddress:user.address,
        requestorName:user?.authorName,
        requestorProfile:user?.profile,
        requesterId:user._id,
        ownerName:nftOwner?.authorName,
        ownerProfile:nftOwner?.profile,
        ownerId:nftOwner._id,
        requestNonce:nextCount
      })

   let copyreq=   await copyright.save();

      const notification=new Notification({
        notification_for:nftOwner.address,
        nftName:nftName,
        nftId:nft.tokenURI,
        owner_profile:user.profile,
        ownerId:user._id,
        type:"request_copyright",
        price:offeredMoney,
        transfer_to:user.authorName,
        copyrightId:copyreq._id
      })

      await notification.save();

      res.send({ status: "success"});
}