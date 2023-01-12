const Binance = require('node-binance-api');
const { ethers } = require("ethers");

module.exports= async function price(nftTextLength) {

    const binance = new Binance();
     let ticker = await binance.prices('BNBUSDT');

     let inDollar=(1 / ticker.BNBUSDT).toFixed(18);
     
     inDollar = (inDollar / 10).toFixed(18);
    

    var estimated_price_inDollar=0;

    if(nftTextLength > 500)
    {
    estimated_price_inDollar=(nftTextLength-1) / 500;
    estimated_price_inDollar= Math.floor(estimated_price_inDollar);
    console.log("🚀 ~ file: price.js ~ line 20 ~ price ~ estimated_price_inDollar", estimated_price_inDollar)
    estimated_price_inDollar=inDollar * estimated_price_inDollar;
    estimated_price_inDollar = ethers.utils.parseUnits(estimated_price_inDollar.toString(), "ether");
    }
    console.log("🚀 ~ file: price.js ~ line 22 ~ price ~ estimated_price_inDollar", estimated_price_inDollar)

    return estimated_price_inDollar;
  };

//   price();