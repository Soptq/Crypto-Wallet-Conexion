const { provider } = require('./accounts');
const { getPriceFromReserves } = require('./getPriceFromReserves');


provider.on("block", (blockNumber) => {
    console.log('Block Nº: '+blockNumber)
    //Emitted on every block change
    //buyLowSellHigh();
    //selectActionToDoOnEveryBlockUpdate();
    //getPriceFromReserves();
    //priceBasedParams();
})

//module.exports = {  };