const { ethers } = require('ethers');

module.exports =async function signMessage(message) {
console.log("🚀 ~ file: sign.js:4 ~ signMessage ~ message:", message)
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey);

const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message))
const signedMessage = await signer.signMessage(ethers.utils.arrayify(messageHash));
console.log(signedMessage);

return signedMessage;

}