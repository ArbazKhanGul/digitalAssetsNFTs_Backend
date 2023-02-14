const { convert } = require('html-to-text');
const crypto = require('crypto');
const NFT = require('../database/nftschema')
const bnb_price=require("../utils/price")
const ipfs=require("../utils/ipfs")

exports.nftCreation = async (req, res) => {

  const nftFrontend = req.body;
  const user = req.user;


  const checkName = await NFT.findOne({nftName: nftFrontend.nftName})
 
 if(checkName){
  throw new Error("NFT name already exists")
 }


  //convert text to proper html format
  let changeText = nftFrontend.nftText.replaceAll("<p><br></p>", "<br>")
  let changeTextSpace = changeText.replaceAll(' ', "&nbsp")
  let text = convert(changeTextSpace, {
    selectors: [
      { selector: 'ul', options: { itemPrefix: ' . ', leadingLineBreaks: -1, trailingLineBreaks: -1 } },
      { selector: 'ol', options: { leadingLineBreaks: -1, trailingLineBreaks: -1 } },
      { selector: 'p', options: { leadingLineBreaks: -1, trailingLineBreaks: 1 } },
    ]
  });
  text = text.replace(/\xA0/g, ' ');






  //create hash of text
  text=text.trim();
  const hash = crypto.createHash('sha256').update(text).digest('hex');


  //find text
  const result = await NFT.findOne({hash})

  

  if(result){
    if(result.status=="notVerified")
    {
    let date=new Date();
    let d1=date.getTime();

    let d2=result.createdAt.getTime() + 1800000;

     if(d2 > d1){
      res.send({ status: "timeNotPass",time:d2-d1})
      return;
     }
     else{
       await NFT.deleteOne({_id:result._id});
     }
    }
    else{
    res.send({ status: "duplicate",result})
    return;
    }
  }


    let ipfspath= await ipfs(nftFrontend.nftName,nftFrontend.nftDescription,nftFrontend.nftLanguage,changeText,hash,user.email,user.address); 

  //length of text
  let nftTextLength = text.length

  //title of nft
  let title=""
  if(nftTextLength<44)
  {
    title=text
  }
  else {
    title=text.substring(0,43) + "..."
  }


  const nft = new NFT({
    nftName: nftFrontend.nftName,
    // nftLanguage: nftFrontend.nftLanguage,
    // nftDescription: nftFrontend.nftDescription,
    // nftText: changeText,
    creator_email: user.email,
    owner_email: user.email,
    creator_address: user.address,
    owner_address: user.address,
    tokenURI:ipfspath,
    hash,
    // nftTextLength,
    title
  })

  const saved_nft = await nft.save();
 
  let estimated_price_inDollar=await bnb_price(nftTextLength);
 
  res.send({ status: "success",price:estimated_price_inDollar,ipfspath})

}