const { convert } = require('html-to-text');
var crypto = require('crypto');
var NFT = require('../database/nftschema')


exports.nftCreation = async (req, res) => {

  const nftFrontend = req.body;
  const user = req.user;


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

  //length of text
  let nftTextLength = text.length


  //create hash of text
  text=text.trim();
  const hash = crypto.createHash('sha256').update(text).digest('hex');


  //find text
  const result = await NFT.findOne({hash})

  console.log("🚀 ~ file: nftcreation.js ~ line 34 ~ exports.nftCreation= ~ result", result)

  if(result){
   res.send({ status: "duplicate",result})
   return;
  }

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
    nftLanguage: nftFrontend.nftLanguage,
    nftDescription: nftFrontend.nftDescription,
    nftText: changeText,
    creator_email: user.email,
    owner_email: user.email,
    creator_address: user.address,
    owner_address: user.address,
    hash,
    nftTextLength,
    title
  })

  const saved_nft = await nft.save();


  console.log("🚀 ~ file: router.js ~ line 50 ~ router.post ~ saved_user", saved_nft)


  res.send({ status: "success" })

}