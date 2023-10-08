const mongosse = require("mongoose");


const transactionSchema = new mongosse.Schema({

    type: {
        type: String,
        required: true,
        trim: true,
    },
    tokenId: {
        type: Number,
        required: true,
        trim: true,
    },
    original:{
        type:Boolean,
        default: true
       },
       
    buyerName: {
        type: String,
        trim: true,
    },
    buyerProfile: {
        type: String,
        trim: true,
    },
    buyerId: {
        type: String,
        trim: true,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
    },
    ownerProfile: {
        type: String,
        required: true,
        trim: true,
    },
    nftName: {
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