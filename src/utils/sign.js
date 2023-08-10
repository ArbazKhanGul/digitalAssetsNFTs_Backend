const { ethers } = require('ethers');

module.exports =async function signMessage(token,nonce,price,address) {

const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey);

const message = ethers.utils.solidityKeccak256(['uint256','uint256','address','uint256'], [token, nonce,address,price]);

const signedMessage = await signer.signMessage(ethers.utils.arrayify(message));


return signedMessage;

}