
const { ethers } = require("ethers");
var NFT = require('../database/nftschema')
const User = require("../database/user");
const Notification = require("../database/notificationSchema");
const Transaction = require("../database/transaction");
const CopyRight = require("../database/copyrightschema")

module.exports = async function listenEvent() {

    const provider = new ethers.providers.JsonRpcProvider();


    const Abi = [
        //Event
        "event Creation(address indexed owner_address,uint indexed tokenId,string tokenURI,bool copyright,uint copyrightprice,address copyrightOwner)",
        "event ApprovalMarketplace(uint tokenId)",
        "function creatorOf(uint tokenId) public view returns(address)"
    ];

    const marketAbi = [
        // Create the market item
        "event MarketItemCreated (uint indexed itemId,uint256 indexed tokenId,address seller,address creator,address owner,uint256 price,string status)",
        "event MarketItemCancel (uint indexed itemId,string status)",
        "event MarketItemSold (uint256 indexed tokenId,address  seller,address  creator,address copyowner,address owner,uint256 creatorProfit,uint256 sellerProfit,uint256 copyOwnerProfit,uint256 sellingPrice)"
    ];

    const nftContract = new ethers.Contract(process.env.Address, Abi, provider);
    const marketContract = new ethers.Contract(process.env.marketAddress, marketAbi, provider);




    provider.once("block", () => {

        nftContract.on("Creation", async (owner_address, tokenId, tokenURI, copyright, copyrightPrice, copyrightOwner, event) => {

            console.log("🚀 ~ file: listenEvent.js:39 ~ nftContract.on ~ copyrightprice:", copyrightPrice.toString());
            console.log("🚀 ~ file: listenEvent.js:39 ~ nftContract.on ~ copyrightOwner:", copyrightOwner);

            try {
                let url = process.env.IPFSURL;
                let substr = tokenURI.substring(url.length);


                const result = await NFT.findOneAndUpdate({ tokenURI: substr }, {
                    $set: {
                        status: "verified", tokenId: tokenId.toString()
                    }
                }, { new: true, useFindAndModify: false })


                let owner = await User.findOneAndUpdate({ address: owner_address }, {
                    $inc: { itemsCreated: 1 }
                }, { new: true, useFindAndModify: false })


                let transaction = new Transaction({
                    type: "create", tokenId: tokenId.toString(), ownerProfile: owner.profile, ownerId: owner._id, ownerName: owner.authorName,
                    nftId: result.tokenURI, nftName: result.nftName, original: result?.original
                })

                await transaction.save();

                if (copyright && owner_address != copyrightOwner) {

                    let copyrightresult = await CopyRight.findOneAndUpdate({ tokenURI: substr, status: "accept" }, {
                        $set: { status: "completed" }
                    }, { new: true, useFindAndModify: false });

                    let original_nft = await NFT.findOne({ nftName: result.nftName, original: true });

                    const notification = new Notification({
                        notification_for: copyrightOwner,
                        nftName: original_nft.nftName,
                        nftId: original_nft.tokenURI,
                        owner_profile: owner.profile,
                        ownerId: owner._id,
                        type: `copyright_money`,
                        price: copyrightPrice.toString(),
                        transfer_to: owner.authorName,
                        copyrightId: copyrightresult._id,
                        copyNftId: result.tokenURI
                    })
                    await notification.save();

                }

            }
            catch (error) {
                console.log("🚀 ~ file: listenEvent.js ~ line 24 ~ nftContract.on ~ error", error)
            }
        });
    })


    provider.once("block", () => {
        nftContract.on("ApprovalMarketplace", async (tokenId, event) => {
            try {
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

    provider.once("block", () => {

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






    provider.once("block", () => {
        marketContract.on("MarketItemSold", async (tokenId, seller, creator, copyowner, owner, creatorProfit, sellerProfit, copyOwnerProfit, sellingPrice, event) => {

            console.log("🚀 ~ file: listenEvent.js:157 ~ marketContract.on ~ copyOwnerProfit:", copyOwnerProfit)
            console.log("🚀 ~ file: listenEvent.js:157 ~ marketContract.on ~ copyowner:", copyowner)


            try {
                //get the new owner email
                let address = owner;
                const users = await User.findOne({ address }, {
                    email: 1, authorName: 1, profile: 1
                })

                //update the owner
                const result = await NFT.findOneAndUpdate({ tokenId: tokenId.toString() }, {
                    $set: {
                        status: "verified", currentSellingId: 0, price: 0, owner_address: address, owner_email: users.email, approved: false,
                        copyrightStatus: "notallowed", copyrightPrice: 0
                    },
                    $inc: { lastPrice: sellingPrice.toString() }
                }, { returnDocument: 'before' })


                //incremnent the previous owner volume
                let sellerProfile = await User.findOneAndUpdate({ address: seller }, {
                    $inc: { volume: sellingPrice.toString(), itemsSell: 1 }
                }, { returnDocument: 'before' });



                let ownerProfile = await User.findOneAndUpdate({ address: owner }, {
                    $inc: { itemsBuy: 1 }
                }, { returnDocument: 'before' })


                await CopyRight.updateMany({ ownerId: sellerProfile._id }, {
                    $set: {
                        ownerId: ownerProfile._id
                        , ownerName: ownerProfile.authorName, ownerProfile: ownerProfile.profile
                    }
                });

                await CopyRight.updateMany({ status: "accept" }, {
                    $set: {
                        status: "reapproval", actionUserId: "", actionUserName: "",
                        actionUserProfile: "", comments: "", signature: "",
                    }
                });

                //insert latest transaction
                let transaction = new Transaction({
                    type: "sell", tokenId: tokenId.toString(), ownerProfile: sellerProfile.profile, ownerName: sellerProfile.authorName,
                    ownerId: sellerProfile._id, buyerProfile: ownerProfile.profile, buyerId: ownerProfile._id, buyerName: ownerProfile.authorName,
                    price: ethers.utils.formatUnits(sellingPrice.toLocaleString('fullwide', { useGrouping: false }), 18), nftId: result.tokenURI, original: result?.original, nftName: result.nftName
                })
                await transaction.save();


                //insert notification
                let insertObj = [];

                if (creatorProfit.toString() > 0) {
                    await User.updateOne({ address: creator }, { $inc: { volume: creatorProfit.toString() } })
                    insertObj = [
                        { notification_for: creator, transfer_to: users?.authorName, price: creatorProfit.toString(), type: "creator_profit", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile },
                        { notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "seller_profit", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile }]
                }
                else if (result?.lastPrice == 0) {
                    insertObj = [{ notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "first_sell", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile }]
                }
                else {
                    insertObj = [{ notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "seller_profit", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile }]
                }

                if(copyOwnerProfit.toString() > 0){
                    await User.updateOne({ address: copyowner }, { $inc: { volume: copyOwnerProfit.toString() } });
                    insertObj.push({ notification_for: copyowner, transfer_to: users?.authorName, price: copyOwnerProfit.toString(), type: "copy_original_creator_profit", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile})
                }

                await Notification.insertMany(insertObj);
            }
            catch (error) {
                console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error)
            }
        });
    });









    provider.once("block", () => {
        marketContract.on("MarketItemCancel", async (itemId, status, event) => {
            console.log("market item cancel event is working")
            try {
                const result = await NFT.updateOne({ currentSellingId: itemId.toString() }, {
                    $set: {
                        status: "verified", currentSellingId: 0, price: 0, approved: false
                    }
                })

            }
            catch (error) {
                console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error)
            }
        });
    });


}


