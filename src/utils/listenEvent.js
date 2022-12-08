
const { ethers } = require("ethers");
var NFT = require('../database/nftschema')

module.exports= function listenEvent(){

const provider = new ethers.providers.JsonRpcProvider();
    const Abi = [
        //Event
        "event Creation(address indexed owner_address,uint indexed tokenId,string tokenURI)",
    ];

    const nftContract = new ethers.Contract(process.env.Address,Abi,provider);

    nftContract.on("Creation",async (owner_address,tokenId, tokenURI, event) => {
        console.log(`Owner address is ${ owner_address } and token id is ${tokenId} and token hash is ${tokenURI}`); //it is event which we use above

        try{
        const result=await NFT.updateOne({hash:tokenURI},{$set:{
            status:"verified",tokenId
          }})
          console.log("🚀 ~ file: listenEvent.js ~ line 22 ~ nftContract.on ~ result", result)
        }
        catch(error){
            console.log("🚀 ~ file: listenEvent.js ~ line 24 ~ nftContract.on ~ error", error)
        }
    });

}


