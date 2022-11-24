const Binance = require('node-binance-api');

module.exports= async function price() {

    const binance = new Binance();
    let ticker = await binance.prices({ symbol: 'BNBUSDT' });
     console.info(`Price of BNB: ${ticker.BNBUSDT}`);

  };