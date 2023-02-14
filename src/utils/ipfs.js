const ipfsClient =require('ipfs-http-client');

module.exports= async function ipfs(name,description,language,text,hash,creatorEmail,creatorAddress) {

    const projectId = process.env.PROJECT_KEY_INFLURA;
    const projectSecret = process.env.INFLURA_KEY;

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

const data = JSON.stringify({
    name, description, language,text,hash,creationDate:new Date(),creatorEmail,creatorAddress
});

const added = await client.add(data)


console.log("🚀 ~ file: nftcreation.js:82 ~ exports.nftCreation= ~ added", added)

return added.path;
}
