const mongosse = require("mongoose");


const notificationSchema = new mongosse.Schema({

    notification_for: {
        type: String,
        required: true,
        trim: true,
    },
    transfer_to: {
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
    tokenId: {
        type: Number,
        min: 0,
        required: true,
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
},
    { timestamps: true },
);


const Notification = mongosse.model("notification", notificationSchema);

module.exports = Notification;