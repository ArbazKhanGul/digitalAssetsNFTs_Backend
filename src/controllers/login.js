const User = require("../database/user");
const web3 = require("web3");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
exports.getNonceLogin = async (req, res) => {
  const walletAddress = req.params.address;
  console.log(req.params.address);

  if (!walletAddress) {
    throw new Error("Please connect to metamask first");
  }

  const address = web3.utils.toChecksumAddress(walletAddress);

  const result = await User.findOne({ address });
  console.log(
    "🚀 ~ file: login.js ~ line 15 ~ exports.getNonceLogin= ~ result",
    result
  );

  if (!result) {
    const add =
      walletAddress.substr(0, 9) + "..." + walletAddress.substr(36, 7);
    throw new Error(`Address ${add} not registered`);
  }

  if (!result.verify) {
    throw new Error("Email not verified");
  }

  if (!result.nonce) {
    throw new Error("Error in Registeration");
  }

  res.status(200).send({
    message: "success",
    nonce: result.nonce,
  });
};

exports.login = async (req, res) => {
  let { address, signature } = req.body;

  if (!signature && !address) {
    throw new Error("Invalid credentials");
  }
  address = web3.utils.toChecksumAddress(address);
  const result = await User.findOne({ address });

  if (!result) {
    throw new Error("User not found");
  }
  const signerAddress = await ethers.utils.verifyMessage(
    result.nonce,
    signature
  );

  if (signerAddress !== address) {
    throw new Error("Invalid Signature");
  }

  req.session.user=result;
  // let token = jwt.sign({ _id:result._id}, process.env.SECRET_KEY_LOGIN);

  
  res.status(200).send({
    message: "success",
    // loginAddress: signerAddress,
    // token: token,
    user:result
  });
};
