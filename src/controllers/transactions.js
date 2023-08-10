const Transaction = require("../database/transaction");

exports.transactions = async (req, res) => {

    let id = req.params.id;
    let query = req.query

    let user = req?.session?.user;

    if(user?.role!="admin"){
          throw new Error("Not an admin")
    }


    const transactions = await Transaction.find({ nftId: nftId }).sort({ createdDate: -1 }).limit(3);

res.send({ status: "success", nft: result, ownerId: user_profile._id, transactions: transactions, copyright_status ,copies:copies,copiesCount:count});

}