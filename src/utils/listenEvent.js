
const { ethers } = require("ethers");
var NFT = require('../database/nftschema')
const User = require("../database/user");
const Notification = require("../database/notificationSchema");
const Transaction = require("../database/transaction");

module.exports = async function listenEvent() {

    const provider = new ethers.providers.JsonRpcProvider();


    const Abi = [
        //Event
        "event Creation(address indexed owner_address,uint indexed tokenId,string tokenURI)",
        "event Approval(uint tokenId)",
        "function creatorOf(uint tokenId) public view returns(address)"
    ];

    const marketAbi = [
        // Create the market item
        "event MarketItemCreated (uint indexed itemId,uint256 indexed tokenId,address seller,address creator,address owner,uint256 price,string status)",
        "event MarketItemCancel (uint indexed itemId,string status)",
        "event MarketItemSold (uint indexed itemId,uint256 indexed tokenId,address  seller,address  creator,address owner,uint256 creatorProfit,uint256 sellerProfit,uint256 sellingPrice)"
    ];

    const nftContract = new ethers.Contract(process.env.Address, Abi, provider);


    const marketContract = new ethers.Contract(process.env.marketAddress, marketAbi, provider);




    provider.once("block",() =>  {

    nftContract.on("Creation", async (owner_address, tokenId, tokenURI, event) => {
        console.log("running")
        try {
            let url=process.env.IPFSURL;
            let substr=tokenURI.substring(url.length);
            
            const result = await NFT.updateOne({ tokenURI: substr }, {
                $set: {
                    status: "verified", tokenId: tokenId.toString()
                }
            })

            await User.updateOne({ address: owner_address }, {
                $inc: { itemsCreated: 1 }
            })

        }
        catch (error) {
            console.log("🚀 ~ file: listenEvent.js ~ line 24 ~ nftContract.on ~ error", error)
        }
    });

    })


    provider.once("block",() =>  {
    nftContract.on("Approval", async (tokenId, event) => {
        try {
            console.log("Approval event is working");
            const result = await NFT.updateOne({ tokenId: tokenId.toString() }, {
                $set: {
                    approved: true
                }
            })
        }
        catch (error) {
            console.log("🚀 ~ file: listenEvent.js ~ line 49 ~ nftContract.on ~ error", error)
        }
    });
    })
    // provider.once("block",() =>  {
    //     console.log("running on once every block creation")
    // })

    // provider.on("block",() =>  {
    //     console.log("Running on on every block creation")
    // })

    provider.once("block",() =>  {

    marketContract.on("MarketItemCreated", async (itemId, tokenId, seller, creator, owner, price, status, event) => {
        console.log("Market event is working");
        try {
            //    if(status.toString() ==="available"){
              
            const result = await NFT.updateOne({ tokenId: tokenId.toString() }, {
                $set: {
                    status: "selling", currentSellingId: itemId.toString(), price: price.toString()
                }
            })
            // }
            // else if(status.toString() ==="sold"){
            //    let address=owner;

            //    const users = await User.findOne({address}, {
            //     email: 1
            //   });
            //     const result=await NFT.updateOne({tokenId: tokenId.toString()},{$set:{
            //         status:"verified",currentSellingId:0,price:0,owner_address:address,owner_email:users.email,approved:false
            //       }})

            //     }
        }
        catch (error) {
            console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error)
        }
    });

    })






     provider.once("block",() =>  {
    marketContract.on("MarketItemSold", async (itemId, tokenId, seller, creator, owner, creatorProfit, sellerProfit, sellingPrice, event) => {

        try {

            //get the new owner email
            let address = owner;

            const users = await User.findOne({ address }, {
                email: 1, authorName: 1,profile:1
            })

            //update the owner
            const result = await NFT.findOneAndUpdate({ tokenId: tokenId.toString() }, {
                $set: {
                    status: "verified", currentSellingId: 0, price: 0, owner_address: address, owner_email: users.email, approved: false,
                },
                $inc: { lastPrice: sellingPrice.toString() }
            },{returnDocument: 'before'})

            console.log("🚀 ~ file: listenEvent.js:135 ~ result ~ result", result)


            //incremnent the previous owner volume
      let sellerProfile=await User.findOneAndUpdate({ address: seller }, {
                $inc: { volume: sellingPrice.toString(), itemsSell: 1 }
            })

     let ownerProfile=  await User.findOneAndUpdate({ address: owner }, {
                $inc: { itemsBuy: 1 }
            })

        //insert latest transaction
            let transaction=new Transaction({sellerProfile: sellerProfile.profile,sellerName:sellerProfile.authorName,
                sellerId:sellerProfile._id,ownerProfile:ownerProfile.profile,ownerId:ownerProfile.id,ownerName:ownerProfile.authorName,
             price:sellingPrice.toString(),nftId:result._id
            })
            await transaction.save();

            //insert notification
            let insertObj = [];

            if (creatorProfit.toString() > 0) {
                await User.updateOne({ address: creator }, { $inc: { volume: creatorProfit.toString() } })
                insertObj = [
                    { notification_for: creator, transfer_to: users?.authorName, price: creatorProfit.toString(), type: "creator_profit", nftName:result?.nftName, nftId:result?.tokenURI,ownerId:users?._id,owner_profile:users?.profile },
                    { notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "seller_profit", nftName:result?.nftName, nftId:result?.tokenURI,ownerId:users?._id,owner_profile:users?.profile }]
            }
            else if(result?.lastPrice==0)
            {
                insertObj = [{ notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "first_sell", nftName:result?.nftName,nftId:result?.tokenURI,ownerId:users?._id,owner_profile:users?.profile }] 
            }
            else {
                insertObj = [{ notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "seller_profit", nftName:result?.nftName,nftId:result?.tokenURI,ownerId:users?._id,owner_profile:users?.profile }]
            }

            const notificaitonResult = await Notification.insertMany(insertObj);
        }
        catch (error) {
            console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error)
        }
    });
});









    provider.once("block",() =>  {
    marketContract.on("MarketItemCancel", async (itemId, status, event) => {
           console.log("market item cancel event is working")
        try {
            const result = await NFT.updateOne({ currentSellingId: itemId.toString() }, {
                $set: {
                    status: "verified", currentSellingId: 0, price: 0
                }
            })
            
        }
        catch (error) {
            console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error)
        }
    });});


}


