const express = require('express');
const NFT = require('../database/nftschema');
const User = require("../database/user");
const Notification = require("../database/notificationSchema");
const Transaction = require("../database/transaction");
const CopyRight = require("../database/copyrightschema");

const router = express.Router();

// Endpoint to handle Creation event
router.post('/updateCreatedEvent', async (req, res) => {
    try {
        const { owner_address, tokenId, tokenURI, copyright, copyrightprice, copyrightOwner } = req.body;
        console.log("🚀 ~ router.post ~ tokenId:", tokenId)

        let url = process.env.IPFSURL;
        let substr = tokenURI.substring(url.length);

        const result = await NFT.findOneAndUpdate({ tokenURI: substr }, {
            $set: {
                status: "verified", tokenId: tokenId.toString()
            }
        }, { new: true });

        let owner = await User.findOneAndUpdate({ address: owner_address }, {
            $inc: { itemsCreated: 1 }
        }, { new: true });

        let transaction = new Transaction({
            type: "create", tokenId: tokenId.toString(), ownerProfile: owner.profile, ownerId: owner._id, ownerName: owner.authorName,
            nftId: result.tokenURI, nftName: result.nftName, original: result?.original
        });

        await transaction.save();

        if (copyright && owner_address !== copyrightOwner) {
            let copyrightresult = await CopyRight.findOneAndUpdate({ tokenURI: substr, status: "accept" }, {
                $set: { status: "completed" }
            }, { new: true });

            let original_nft = await NFT.findOne({ nftName: result.nftName, original: true });

            const notification = new Notification({
                notification_for: copyrightOwner,
                nftName: original_nft.nftName,
                nftId: original_nft.tokenURI,
                owner_profile: owner.profile,
                ownerId: owner._id,
                type: `copyright_money`,
                price: copyrightprice.toString(),
                transfer_to: owner.authorName,
                copyrightId: copyrightresult._id,
                copyNftId: result.tokenURI
            });
            await notification.save();
        }

        res.send("Database updated with the latest event");
    } catch (error) {
        console.log("🚀 ~ updateCreatedEvent ~ error", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to handle ApprovalMarketplace event
router.post('/updateApprovalMarketplaceEvent', async (req, res) => {
    try {
        const { tokenId } = req.body;

        await NFT.updateOne({ tokenId: tokenId.toString() }, {
            $set: {
                approved: true
            }
        });

        res.send("Database updated with the latest ApprovalMarketplace event");
    } catch (error) {
        console.log("🚀 ~ updateApprovalMarketplaceEvent ~ error", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to handle MarketItemCreated event
router.post('/updateMarketItemCreatedEvent', async (req, res) => {
    try {
        const { itemId, tokenId, seller, creator, owner, price, status } = req.body;

        await NFT.updateOne({ tokenId: tokenId.toString() }, {
            $set: {
                status: "selling", currentSellingId: itemId.toString(), price: price.toString()
            }
        });

        res.send("Database updated with the latest MarketItemCreated event");
    } catch (error) {
        console.log("🚀 ~ updateMarketItemCreatedEvent ~ error", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to handle MarketItemSold event
router.post('/updateMarketItemSoldEvent', async (req, res) => {
    try {
        const { tokenId, seller, creator, copyowner, owner, creatorProfit, sellerProfit, copyOwnerProfit, sellingPrice } = req.body;

        let address = owner;
        const users = await User.findOne({ address }, {
            email: 1, authorName: 1, profile: 1
        });

        const result = await NFT.findOneAndUpdate({ tokenId: tokenId.toString() }, {
            $set: {
                status: "verified", currentSellingId: 0, price: 0, owner_address: address, owner_email: users.email, approved: false,
                copyrightStatus: "notallowed", copyrightPrice: 0
            },
            $inc: { lastPrice: sellingPrice.toString() }
        }, { returnDocument: 'before' });

        let sellerProfile = await User.findOneAndUpdate({ address: seller }, {
            $inc: { volume: sellingPrice.toString(), itemsSell: 1 }
        }, { returnDocument: 'before' });

        let ownerProfile = await User.findOneAndUpdate({ address: owner }, {
            $inc: { itemsBuy: 1 }
        }, { returnDocument: 'before' });

        await CopyRight.updateMany({ ownerId: sellerProfile._id }, {
            $set: {
                ownerId: ownerProfile._id,
                ownerName: ownerProfile.authorName, ownerProfile: ownerProfile.profile
            }
        });

        await CopyRight.updateMany({ status: "accept" }, {
            $set: {
                status: "reapproval", actionUserId: "", actionUserName: "",
                actionUserProfile: "", comments: "", signature: "",
            }
        });

        let transaction = new Transaction({
            type: "sell", tokenId: tokenId.toString(), ownerProfile: sellerProfile.profile, ownerName: sellerProfile.authorName,
            ownerId: sellerProfile._id, buyerProfile: ownerProfile.profile, buyerId: ownerProfile._id, buyerName: ownerProfile.authorName,
            price: ethers.utils.formatUnits(sellingPrice.toLocaleString('fullwide', { useGrouping: false }), 18), nftId: result.tokenURI, original: result?.original, nftName: result.nftName
        });
        await transaction.save();

        let insertObj = [];

        if (creatorProfit.toString() > 0) {
            await User.updateOne({ address: creator }, { $inc: { volume: creatorProfit.toString() } });
            insertObj = [
                { notification_for: creator, transfer_to: users?.authorName, price: creatorProfit.toString(), type: "creator_profit", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile },
                { notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "seller_profit", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile }
            ];
        } else if (result?.lastPrice == 0) {
            insertObj = [{ notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "first_sell", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile }];
        } else {
            insertObj = [{ notification_for: seller, transfer_to: users?.authorName, price: sellerProfit.toString(), type: "seller_profit", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile }];
        }

        if (copyOwnerProfit.toString() > 0) {
            await User.updateOne({ address: copyowner }, { $inc: { volume: copyOwnerProfit.toString() } });
            insertObj.push({ notification_for: copyowner, transfer_to: users?.authorName, price: copyOwnerProfit.toString(), type: "copy_original_creator_profit", nftName: result?.nftName, nftId: result?.tokenURI, ownerId: users?._id, owner_profile: users?.profile });
        }

        await Notification.insertMany(insertObj);

        res.send("Database updated with the latest MarketItemSold event");
    } catch (error) {
        console.log("🚀 ~ updateMarketItemSoldEvent ~ error", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint to handle MarketItemCancel event
router.post('/updateMarketItemCancelEvent', async (req, res) => {
    try {
        const { itemId, status } = req.body;

        await NFT.updateOne({ currentSellingId: itemId.toString() }, {
            $set: {
                status: "verified", currentSellingId: 0, price: 0, approved: false
            }
        });

        res.send("Database updated with the latest MarketItemCancel event");
    } catch (error) {
        console.log("🚀 ~ updateMarketItemCancelEvent ~ error", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
