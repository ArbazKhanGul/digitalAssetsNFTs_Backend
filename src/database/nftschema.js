const mongosse = require("mongoose");


const nftSchema = new mongosse.Schema({

  nftName: {
    type: String,
    required: true,
    trim : true,
    lowercase: true,
  },

  contentURI: {
    type: String,
    required: true,
    trim : true
  },

  hash: {
    type: String,
    required: true,
    trim : true
  },

  originalTokenURI: {
    type: String,
    trim : true,
    default:"nothing"
  },
  contentType: {
    type: String,
    required: true,
    trim : true
  },
  language: {
    type: String,
    trim : true
  },
  tokenURI: {
    type: String,
    required: true,
    trim : true
  },
  original:{
    type:Boolean,
    default: true
   },

   copyrightStatus: {
    type: String,
    trim : true,
    default: 'notallowed'
  },

  copyrightPrice: {
    type: Number,
    default: 0.0,
    min: 0,
  },

  copyNonce: {
    type: Number,
    default: 0.0,
    min: 0,
  },

  creator_email: {
    type: String,
    required: true,
    trim : true,
    lowercase: true,
  },
   owner_email: {
    type: String,
    required: true,
    trim : true,
    lowercase: true,
      },
  creator_address: {
    type: String,
    required: true,
    trim : true,
  },
  owner_address: {
    type: String,
    required: true,
    trim : true,
  },
  status:{
   type: String,
   default: "notVerified",
   trim:true
  },
  tokenId:{
    type: Number,
    min: 0,
  },
  currentSellingId:{
    type: Number,
    default: 0,
    min: 0,
  },
  price:{
    type: Number,
    default: 0.0,
    min: 0,
  },
  createdAt:{
     type: Date,
     required: true,
  },
  lastPrice:{
    type: Number,
    default: 0.0,
    min: 0,
  },
  approved:{
    type: Boolean,
    default: true
  }
},
);


const NFT = mongosse.model("nftInfo", nftSchema);


module.exports = NFT;