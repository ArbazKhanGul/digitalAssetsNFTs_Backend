const mongosse = require("mongoose");


const UserSchema = new mongosse.Schema({
  authorName: {
    type: String,
    required: true,
    trim : true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim : true,
    lowercase: true,
    immutable: true
  },
  description:{
    type:String,
    trim:true,
    required: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
    trim : true,
    immutable: true
  },
  profile: {
    type: String,
    required: true,
    trim : true,
  },
  cover: {
    type: String,
    required: true,
    trim : true,
  },
  role: {
    type: String,
    required: true,
    lowercase: true,
    enum: ["admin", "user"],
    default: "user",
  },
  verify: {
    type: Boolean,
    default: false,
  },
  nonce: {
    type:String,
    required: true,
  },
  volume:{
    type: Number,
    default: 0,
    min: 0,
  },
  itemsCreated:{
    type: Number,
    default: 0,
    min: 0,
  },
  itemsBuy:{
    type: Number,
    default: 0,
    min: 0,
  },
  itemsSell:{
  type: Number,
  default: 0,
  min: 0,
  }
},
{ timestamps: true },

);



const User = mongosse.model("SignUpForm", UserSchema);

module.exports = User;