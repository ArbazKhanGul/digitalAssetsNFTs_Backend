const ipfsClient =require('ipfs-http-client');

let arb=async ()=>{

const projectId = '2J1VjR9BuVpSDC33nS6hpLONikL';
const projectSecret = '6967a1bdc3d1ca8c2d10c472705917dc';

const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

// let client=ipfsClient.create(`https://ipfs.infura.io:5001/2J1VjR9BuVpSDC33nS6hpLONikL`);

// // const ipfs=client(`https://ipfs.infura.io:5001/${process.env.INFLURA_KEY}`)
const added = await client.get('QmNm69grDTMkoAJYDsme4v7WqWVzvHo4eLPYi3bbZQXtKd');
console.log("🚀 ~ file: nftcreation.js:82 ~ exports.nftCreation= ~ added", added)

}

arb()




const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'https://abc.com', credentials: true }));

app.get('/set-cookie', (req, res) => {
  const token = jwt.sign({ userId: 123 }, 'my_secret_key');
  res.cookie('myCookie', token, { domain: 'xyz.com', path: '/', httpOnly: true, secure: true, sameSite: 'none' });
  res.send('Cookie set!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
