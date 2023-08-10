const mongosse = require("mongoose");


const copyrightSchema = new mongosse.Schema({

  nftName: {
    type: String,
    required: true,
    trim: true,
   },
  nftId: {
    type: String,
    required: true,
    trim: true,
  },
  offeredMoney: {
    type: String,
    default: 0,
    min: 0,
    required: true
  },
  requestorName: {
    type: String,
    required: true,
    trim: true,  },

  requesterId: {
    type: String,
    required: true,
    trim: true,
      },
  requestorProfile: {
    type: String,
    required: true,
    trim: true,
  },
  tokenURI: {
    type: String,
    trim: true,  },

  actionUserName: {
    type: String,
    trim: true,  },

  actionUserId: {
    type: String,
    trim: true,
      },
  actionUserProfile: {
    type: String,
    trim: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
     },
  ownerId: {
    type: String,
    required: true,
    trim: true,
    },
  ownerProfile: {
    type: String,
    required: true,
    trim: true,
    },
  comments: {
    type: String,
    trim: true,
   },
  status: {
    type: String,
    default: "pending",
    trim: true,
    required: true
  },

},
  { timestamps: true },
);


const NFT = mongosse.model("copyrights", copyrightSchema);


module.exports = NFT;