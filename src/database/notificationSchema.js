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
        trim: true,
    },
    nftId:{
        type: String,
        trim: true,
    },
    ownerId:{
        type: String,
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
    copyNftId:{
        type: String,
        trim: true,
    },
    userId:{
        type: String,
        trim: true,
    },
    userName:{
        type: String,
        trim: true,
    }

},
    { timestamps: true },
);


const Notification = mongosse.model("notification", notificationSchema);

module.exports = Notification;