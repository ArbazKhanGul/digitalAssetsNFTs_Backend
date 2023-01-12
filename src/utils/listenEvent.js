
const { ethers } = require("ethers");
var NFT = require('../database/nftschema')
const User = require("../database/user");

module.exports=async function listenEvent(){

    const provider = new ethers.providers.JsonRpcProvider();

    const Abi = [
        //Event
        "event Creation(address indexed owner_address,uint indexed tokenId,string tokenURI)",
        "function creatorOf(uint tokenId) public view returns(address)"
    ];

    const marketAbi = [
        // Create the market item
        "event MarketItemCreated (uint indexed itemId,uint256 indexed tokenId,address seller,address creator,address owner,uint256 price,string status)",
        "event MarketItemCancel (uint indexed itemId,string status)"
    ];

    const nftContract = new ethers.Contract(process.env.Address,Abi,provider);


    const marketContract = new ethers.Contract(process.env.marketAddress,marketAbi,provider);


    nftContract.on("Creation",async (owner_address,tokenId, tokenURI, event) => {
 
        try{
        const result=await NFT.updateOne({hash:tokenURI},{$set:{
            status:"verified",tokenId:tokenId.toString()
          }})
         }
        catch(error){
            console.log("🚀 ~ file: listenEvent.js ~ line 24 ~ nftContract.on ~ error", error)
        }
    });


   marketContract.on("MarketItemCreated",async (itemId,tokenId, seller,creator,owner,price,status, event) => {

    console.log("🚀 ~ file: listenEvent.js:41 ~ marketContract.on ~ owner", owner)


        try{
           if(status.toString() ==="available"){
        const result=await NFT.updateOne({tokenId: tokenId.toString()},{$set:{
            status:"selling",currentSellingId:itemId.toString(),price:price.toString()
          }})
        }
        else if(status.toString() ==="sold"){
           let address=web3.utils.toChecksumAddress(owner);

           const users = await User.findOne({address}, {
            email: 1
          });
            const result=await NFT.updateOne({tokenId: tokenId.toString()},{$set:{
                status:"verified",currentSellingId:0,price:0,owner_address:address,owner_email:users.email
              }})
        }

    }
        catch(error){
            console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error)
        }
    });




    marketContract.on("MarketItemCancel",async (itemId,status, event) => {

        try{
        const result=await NFT.updateOne({currentSellingId : itemId.toString()},{$set:{
            status:"verified",currentSellingId:0,price:0
          }})
          console.log("🚀 ~ file: listenEvent.js ~ line 22 ~ nftContract.on ~ result", result)
        }
        catch(error){
            console.log("🚀 ~ file: listenEvent.js:61 ~ marketContract.on ~ error", error)
        }
    });


}


