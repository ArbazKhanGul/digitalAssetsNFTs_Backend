const Binance = require('node-binance-api');
const { ethers } = require("ethers");

module.exports= async function price(size,type) {

    const binance = new Binance();
     let ticker = await binance.prices('BNBUSDT');

     let inDollar=(1 / ticker.BNBUSDT).toFixed(18);

     

    var estimated_price_inDollar=0;

    if(size > 500 && type=="text")
    {
    inDollar = (inDollar / 10).toFixed(18);
    console.log("🚀 ~ file: price.js:18 ~ price ~ inDollar:", inDollar)
    estimated_price_inDollar=(size-1) / 500;
    estimated_price_inDollar= Math.floor(estimated_price_inDollar);
    estimated_price_inDollar=inDollar * estimated_price_inDollar;
    estimated_price_inDollar = ethers.utils.parseUnits(estimated_price_inDollar.toString(), "ether");
    }
    else if(size > 100 && type=="media"){
      let con=Math.ceil(size);
      estimated_price_inDollar=(con-1) / 100;
      estimated_price_inDollar= Math.floor(estimated_price_inDollar);
      estimated_price_inDollar=inDollar * estimated_price_inDollar;
      estimated_price_inDollar = ethers.utils.parseUnits(estimated_price_inDollar.toString(), "ether");
    }

    return estimated_price_inDollar;
  };
