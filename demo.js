// // const ipfsClient =require('ipfs-http-client');

// const { ethers } = require('ethers');


// let arb=async (message) => {
//   console.log("🚀 ~ file: demo.js:7 ~ arb ~ message:", message)

//   const privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
//   // console.log("🚀 ~ file: demo.js:8 ~ arb ~ privateKey:", privateKey)
// const signer = new ethers.Wallet(privateKey);



// const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message))

// console.log("🚀 ~ file: demo.js:12 ~ arb ~ messageHash:", messageHash)

// const signedMessage = await signer.signMessage(ethers.utils.arrayify(messageHash));


// // "\x19Ethereum Signed Message:\n32"

// console.log(signedMessage);

// }


// let sec=async(token,nonce,address)=>{

//   const privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  
//   const price = ethers.utils.parseEther('3'); // Price value in Ether
  
//   const message = ethers.utils.solidityKeccak256(['uint256','uint256','address','uint256'], [token, nonce,address,price]);
//   console.log("🚀 ~ file: demo.js:36 ~ sec ~ message:", message)
  
//   // const messageHash = ethers.utils.keccak256(message)
//   // console.log("🚀 ~ file: demo.js:38 ~ sec ~ messageHash:", messageHash)


//   const signer = new ethers.Wallet(privateKey);



// // const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message))

// // console.log("🚀 ~ file: demo.js:12 ~ arb ~ messageHash:", messageHash)

// const signedMessage = await signer.signMessage(ethers.utils.arrayify(message));


// // "\x19Ethereum Signed Message:\n32"

// console.log(signedMessage);

  
//   // let messageHash=ethers.utils.keccak256(message);
//   // console.log("🚀 ~ file: demo.js:39 ~ sec ~ messageHash:", messageHash)

//   // const signature = signingKey.signDigest();
  
//   // const signatureString = signature.toHexString();
//   // console.log("🚀 ~ file: demo.js:39 ~ sec ~ signatureString:", signatureString)
// }

// sec(1,1,"0x70997970C51812dc3A010C7d01b50e0d17dc79C8")

// // const projectId = '2J1VjR9BuVpSDC33nS6hpLONikL';
// // const projectSecret = '6967a1bdc3d1ca8c2d10c472705917dc';

// // const auth =
// //     'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// // const client = ipfsClient.create({
// //     host: 'ipfs.infura.io',
// //     port: 5001,
// //     protocol: 'https',
// //     headers: {
// //         authorization: auth,
// //     },
// // });

// // // let client=ipfsClient.create(`https://ipfs.infura.io:5001/2J1VjR9BuVpSDC33nS6hpLONikL`);

// // // // const ipfs=client(`https://ipfs.infura.io:5001/${process.env.INFLURA_KEY}`)
// // const added = await client.get('QmNm69grDTMkoAJYDsme4v7WqWVzvHo4eLPYi3bbZQXtKd');
// // console.log("🚀 ~ file: nftcreation.js:82 ~ exports.nftCreation= ~ added", added)

// // }



// // arb(1+"_"+1+"_"+3000000000000000000+"_"+"0xdD2FD4581271e230360230F9337D5c0430Bf44C0")




// // const express = require('express');
// // const jwt = require('jsonwebtoken');
// // const cors = require('cors');
// // const app = express();

// // app.use(cors({ origin: 'https://abc.com', credentials: true }));

// // app.get('/set-cookie', (req, res) => {
// //   const token = jwt.sign({ userId: 123 }, 'my_secret_key');
// //   res.cookie('myCookie', token, { domain: 'xyz.com', path: '/', httpOnly: true, secure: true, sameSite: 'none' });
// //   res.send('Cookie set!');
// // });

// // app.listen(3000, () => {
// //   console.log('Server listening on port 3000');
// // });


const { ethers } = require('ethers');

async function signMessage(token,nonce,price,address) {

const privateKey = "92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e"
const signer = new ethers.Wallet(privateKey);

const message = ethers.utils.solidityKeccak256(['uint256','uint256','address','uint256'], [token, nonce,address,price]);
console.log("🚀 ~ file: demo.js:125 ~ signMessage ~ message:", message)

const signedMessage = await signer.signMessage(ethers.utils.arrayify(message));
console.log("🚀 ~ file: demo.js:127 ~ signMessage ~ signedMessage:", signedMessage)


// return signedMessage;

}


signMessage(1,1,"1000000000000000000","0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")