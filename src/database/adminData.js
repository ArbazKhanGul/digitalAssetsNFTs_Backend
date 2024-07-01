const mongosse = require("mongoose");


const adminDataSchema = new mongosse.Schema({

  platformBnbIncrement: {
    type: Number,
    required: true,
    trim: true,
    default:0
   },
  maximumTransfer: {
    type: Number,
    required: true,
    trim: true,
    default:1
  },
  nftCreationFee:{
    type:Number,
    required:true,
    trim:true,
    default:0
  }
},
  { timestamps: true },
);


const data = mongosse.model("admindata", adminDataSchema);


module.exports = data;