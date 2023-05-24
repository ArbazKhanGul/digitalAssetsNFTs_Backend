const User= require('../database/user');
var CopyRight = require('../database/copyrightschema');
const NFT= require('../database/nftschema');
const Notification = require("../database/notificationSchema");

exports.copyright = async (req, res) => {

  let { offeredMoney,nftName,ownerId} = req?.body;


    let user = req?.session?.user
    let nftOwner = await User.findOne({ _id:ownerId});

    let nft =  await NFT.findOne({ nftName: nftName, status: { $ne: "notVerified" } }, {
      tokenURI:1
  });

    const copyright = new CopyRight({
        nftName: nftName,
        nftId:nft.tokenURI,
        offeredMoney:offeredMoney,
        requestorName:user?.authorName,
        requestorProfile:user?.profile,
        requesterId:user._id,
        ownerName:nftOwner?.authorName,
        ownerProfile:nftOwner?.profile,
        ownerId:nftOwner._id,
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