const mongosse = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
var mongodbErrorHandler = require('mongoose-mongodb-errors')


mongosse.plugin(mongodbErrorHandler);



const UserSchema = new mongosse.Schema({
  collectionName: {
    type: String,
    required: true,
    trim : true,
    lowercase: true,
  },
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
    trim:true
  },
  address: {
    type: String,
    required: true,
    // unique: true,
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
  floorPrice:{
    type: Number,
    default: 0.0,
    min: 0,
  }
},
{ timestamps: true },

);

// We are bcrypting password here

// UserSchema.pre("save", async function (next) {
//   console.log("Running pre funciton");
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });

// UserSchema.methods.generateAuthToken = async function () {
//   try {
//     let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
//     this.date = Date.now();
//     await this.save();
//     console.log("Im token");
//     return token;
//   } catch (err) {
//     console.log(err);
//   }
// };

const User = mongosse.model("SignUpForm", UserSchema);

module.exports = User;