const Binance = require('node-binance-api');
const { ethers } = require("ethers");

module.exports= async function price(size,type) {

  try{
    const binance = new Binance();
     let ticker = await binance.prices('BNBUSDT');

     let inDollar=(1 / ticker.BNBUSDT).toFixed(18);

    var estimated_price_inDollar=0;


    if(size > 1000 && type=="text")
    {
    inDollar = (inDollar / 10).toFixed(18);
    estimated_price_inDollar=(size-1) / 1000;
    estimated_price_inDollar= Math.floor(estimated_price_inDollar);
    estimated_price_inDollar=inDollar * estimated_price_inDollar;
    estimated_price_inDollar = ethers.utils.parseUnits(estimated_price_inDollar.toString(), "ether");
    }
    else if(size > 50 && type=="media"){
      let con=Math.ceil(size);
      estimated_price_inDollar=(con-1) / 50;
      estimated_price_inDollar= Math.floor(estimated_price_inDollar);
      estimated_price_inDollar=inDollar * estimated_price_inDollar;
      estimated_price_inDollar = ethers.utils.parseUnits(estimated_price_inDollar.toString(), "ether");
    }

    return estimated_price_inDollar;
  }
  catch(error){
    console.log("🚀 ~ price ~ error:", error)
    return 0;
  }
  };
