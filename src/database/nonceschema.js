const mongosse = require("mongoose");


const NonceSchema = new mongosse.Schema({
    nonce:{
        type: Number,
        default: 0,
        min: 0,
      },
}
);

NonceSchema.statics.getNextCount = async function() {
    const counter = await this.findOneAndUpdate({}, { $inc: { nonce: 1 } }, { new: true, upsert: true });
    return counter.nonce;
  };
  

const Nonce = mongosse.model("nonce", NonceSchema);



module.exports = Nonce;