const { ethers } = require("ethers");
var NFT = require('../database/nftschema');
const User = require("../database/user");
const Notification = require("../database/notificationSchema");
const Transaction = require("../database/transaction");
const CopyRight = require("../database/copyrightschema")

module.exports = async function listenEvent() {

    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");

    // Handle WebSocket connection errors
    provider.on("error", (error) => {
        console.error("WebSocket error:", error);
    });

    // Log connection status
    provider.on("open", () => {
        console.log("Connected to BNB testnet via WebSocket");
    });

    provider.on("close", () => {
        console.log("Disconnected from BNB testnet WebSocket");
    });

    const Abi = [
        // Event
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

    // Listen for new blocks
    provider.on("block", (blockNumber) => {
        console.log("New block:", blockNumber);
    });

    // Function to handle retries with exponential backoff
    async function withRetries(fn, retries = 5) {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
                console.error(`Retry ${i + 1}/${retries} failed:`, error);
                await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000)); // Exponential backoff
            }
        }
    }

    // Function to handle the Creation event
    async function handleCreationEvent(owner_address, tokenId, tokenURI, copyright, copyrightPrice, copyrightOwner, event) {
        console.log("🚀 ~ file: listenEvent.js:39 ~ nftContract.on ~ copyrightprice:", copyrightPrice.toString());
        console.log("🚀 ~ file: listenEvent.js:39 ~ nftContract.on ~ copyrightOwner:", copyrightOwner);

        try {
            let url = process.env.IPFSURL;
            let substr = tokenURI.substring(url.length);

            const result = await NFT.findOneAndUpdate({ tokenURI: substr }, {
                $set: {
                    status: "verified", tokenId: tokenId.toString()
                }
            }, { new: true, useFindAndModify: false });

            let owner = await User.findOneAndUpdate({ address: owner_address }, {
                $inc: { itemsCreated: 1 }
            }, { new: true, useFindAndModify: false });

            let transaction = new Transaction({
                type: "create", tokenId: tokenId.toString(), ownerProfile: owner.profile, ownerId: owner._id, ownerName: owner.authorName,
                nftId: result.tokenURI, nftName: result.nftName, original: result?.original
            });

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
                });
                await notification.save();
            }

        } catch (error) {
            console.log("🚀 ~ file: listenEvent.js ~ line 24 ~ nftContract.on ~ error", error);
        }
    }

    // Function to handle the ApprovalMarketplace event
    async function handleApprovalMarketplaceEvent(tokenId, event) {
        try {
            await NFT.updateOne({ tokenId: tokenId.toString() }, {
                $set: {
                    approved: true
                }
            });
        } catch (error) {
            console.log("🚀 ~ file: listenEvent.js ~ line 49 ~ nftContract.on ~ error", error);
        }
    }

    // Function to handle the MarketItemCreated event
    async function handleMarketItemCreatedEvent(itemId, tokenId, seller, creator, owner, price, status, event) {
        console.log("Market event is working");
        try {
            await NFT.updateOne({ tokenId: tokenId.toString() }, {
                $set: {
                    status: "selling", currentSellingId: itemId.toString(), price: price.toString()
                }
            });
        } catch (error) {
            console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error);
        }
    }

    // Function to handle the MarketItemSold event
    async function handleMarketItemSoldEvent(tokenId, seller, creator, copyowner, owner, creatorProfit, sellerProfit, copyOwnerProfit, sellingPrice, event) {
        console.log("🚀 ~ file: listenEvent.js:157 ~ marketContract.on ~ copyOwnerProfit:", copyOwnerProfit);
        console.log("🚀 ~ file: listenEvent.js:157 ~ marketContract.on ~ copyowner:", copyowner);

        try {
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
        } catch (error) {
            console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error);
        }
    }

    // Function to handle the MarketItemCancel event
    async function handleMarketItemCancelEvent(itemId, status, event) {
        console.log("market item cancel event is working");
        try {
            await NFT.updateOne({ currentSellingId: itemId.toString() }, {
                $set: {
                    status: "verified", currentSellingId: 0, price: 0, approved: false
                }
            });
        } catch (error) {
            console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error);
        }
    }

    // Register event listeners
    nftContract.on("Creation", async (owner_address, tokenId, tokenURI, copyright, copyrightPrice, copyrightOwner, event) => {
        await withRetries(() => handleCreationEvent(owner_address, tokenId, tokenURI, copyright, copyrightPrice, copyrightOwner, event));
    });

    nftContract.on("ApprovalMarketplace", async (tokenId, event) => {
        await withRetries(() => handleApprovalMarketplaceEvent(tokenId, event));
    });

    marketContract.on("MarketItemCreated", async (itemId, tokenId, seller, creator, owner, price, status, event) => {
        await withRetries(() => handleMarketItemCreatedEvent(itemId, tokenId, seller, creator, owner, price, status, event));
    });

    marketContract.on("MarketItemSold", async (tokenId, seller, creator, copyowner, owner, creatorProfit, sellerProfit, copyOwnerProfit, sellingPrice, event) => {
        await withRetries(() => handleMarketItemSoldEvent(tokenId, seller, creator, copyowner, owner, creatorProfit, sellerProfit, copyOwnerProfit, sellingPrice, event));
    });

    marketContract.on("MarketItemCancel", async (itemId, status, event) => {
        await withRetries(() => handleMarketItemCancelEvent(itemId, status, event));
    });
}
