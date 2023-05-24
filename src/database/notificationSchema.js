const mongosse = require("mongoose");


const notificationSchema = new mongosse.Schema({

    notification_for: {
        type: String,
        required: true,
        trim: true,
    },
    transfer_to: {
        type: String,
        trim: true,
    },
    owner_profile: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    nftName: {
        type: String,
        required: true,
        trim: true,
    },
    nftId:{
        type: String,
        required: true,
        trim: true,
    },
    ownerId:{
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        default: 0,
        min: 0,
    },
    status: {
        type: Boolean,
        default: false,
    },
    copyrightId:{
        type: String,
        trim: true,
    },
},
    { timestamps: true },
);


const Notification = mongosse.model("notification", notificationSchema);

module.exports = Notification;