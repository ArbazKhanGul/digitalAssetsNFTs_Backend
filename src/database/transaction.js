const mongosse = require("mongoose");


const transactionSchema = new mongosse.Schema({

    sellerName: {
        type: String,
        required: true,
        trim: true,
    },
    sellerProfile: {
        type: String,
        required: true,
        trim: true,
    },
    sellerId: {
        type: String,
        required: true,
        trim: true,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    ownerProfile: {
        type: String,
        required: true,
        trim: true,
    },
    ownerId:{
        type: String,
        required: true,
        trim: true,
    },
    nftId:{
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        default: 0,
        min: 0,
    },
} ,{ timestamps: true },
);


const Transaction = mongosse.model("transaction", transactionSchema);

module.exports = Transaction;