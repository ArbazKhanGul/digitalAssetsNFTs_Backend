const mongosse = require("mongoose");


const nftSchema = new mongosse.Schema({

  nftName: {
    type: String,
    required: true,
    trim : true,
    lowercase: true,
  },
  // nftLanguage: {
  //   type: String,
  //   required: true,
  //   trim : true,
  //   lowercase: true,
  // },
  tokenURI: {
    type: String,
    required: true,
    trim : true
  },
  // nftText: {
  //   type: String,
  //   required: true,
  //   trim : true,
  //   unique : true,
  // },
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
  // nftDescription:{
  //   type:String,
  //   trim:true,
  //   required: true,
  // },
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
  
  hash: {    
    type: String,
    required: true,
    trim : true,
    unique:true
  },
  // nftTextLength:{
  //   type: Number,
  // },
  status:{
   type: String,
   default: "notVerified",
   trim:true
  },
  title:{
    type:String,
    trim:true,
    required:true,
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
{ timestamps: true },
);


const NFT = mongosse.model("nftInfo", nftSchema);


module.exports = NFT;