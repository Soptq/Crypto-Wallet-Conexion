const ethers = require('ethers');
const chalk = require('chalk');
const { accounts, provider } = require('./accounts');
const { addresses, tokens, holdings, symbolHoldings } = require('./parameters');
const { getPriceFromReserves, getPriceBNB, getPriceToken } = require('./getPriceFromReserves');

//Get token balance of: userAddress
const checkBalanceToken = async (tokenAddress, userAddress) => {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function balanceOf(address owner) external view returns (uint)',
      ],
      provider
    );
      const tokenBalance = await tokenContract.balanceOf(userAddress);
      return tokenBalance;
}
  
//Get balance BNB of: userAddress
const checkBalanceBNB = async (userAddress) => {
    const balance = await provider.getBalance(userAddress);
    return balance.toString();
}

//Get value token of: userAddress
const getTokenVal = async (tokenAddress, userAddress) => {
  let tokenBal = await checkBalanceToken(tokenAddress, userAddress);
  console.log('TokenBal: '+tokenBal);
  const value = await getPriceToken(tokenBal, [addresses.tokenToTrade, tokens.WBNB, tokens.BUSD]);
  console.log('VALUE TOKEN: '+value);
  return value;
}

const jinfo = async () => {

  let tokenArray = [addresses.tokenToTrade, addresses.tokenToTrade, addresses.tokenToTrade, addresses.tokenToTrade, tokens.BUSD, tokens.NEAR];
  let balances = [];
  let totalBNB = 0;
  let totalBUSD = 0;

  for (let i = 0; i < accounts.length; i++) {
    let balanceBNB = await checkBalanceBNB(accounts[i].address);
    console.log('Account '+i+' BNB: '+balanceBNB* 1e-18)
    for (let j = 0; j < holdings.length; j++) {
      let tokenBal = await checkBalanceToken(holdings[j], accounts[i].address);
      //console.log('holdings '+holdings.length)
      console.log('Account '+i+' token '+j+'('+symbolHoldings[j]+'): '+tokenBal* 1e-18)
    }
  }
}


const totalBalances = async () => {

  let totaltoken = 0;
  let totalBNB = 0;
  let totalBUSD = 0;
  let totalWUSD = 0;
  let totalValue = 0;
  for (let i = 0; i < accounts.length; i++) {
    //console.log(accounts[i].address); //print all addresses up to length
    //Print all addresses of mnemonic up to length with BNB and Token Balance
    let bnbBal = await checkBalanceBNB(accounts[i].address);
    let tokenBal = await checkBalanceToken(addresses.tokenToTrade, accounts[i].address);
    let busdBal = await checkBalanceToken(tokens.BUSD, accounts[i].address);
    let price = await getPriceFromReserves();
    let priceBNB = await getPriceFromReservesUSD();
    console.log('Account '+i+': '+accounts[i].address+'\n'+
    chalk.yellow(' BNB: '+bnbBal* 1e-18)+'\n'+
    chalk.yellow(' BUSD: '+busdBal* 1e-18)+'\n'+
    chalk.yellow(' price: '+price* 1e-18)+'\n'+
    chalk.yellow(' priceBNB: '+priceBNB* 1e-18)+'\n'+
    chalk.yellow(' BUSD: '+busdBal* 1e-18)+'\n'+
    chalk.yellow(' BTBS: '+tokenBal* 1e-18));

    totaltoken = tokenBal*1+totaltoken;
    totalBNB =+ bnbBal*1+totalBNB;
    totalBNBvalue = totalBNB*priceBNB;
    totalBUSD =+ busdBal*1+totalBUSD;
    totalValueToken =+ price*1*totaltoken;
    totalValueUSD =+ totalValueToken*priceBNB;
    totalValue = totalValueToken+totalBNBvalue+totalBUSD;
    console.log('=== TOTALS: ===');
    console.log(chalk.cyanBright(' BNB: '+totalBNB* 1e-18+' = '+totalBNBvalue* 1e-18+'$')+'\n'+
    chalk.cyanBright(' BUSD: '+totalBUSD* 1e-18)+'\n'+
    chalk.cyanBright(' BTBS: '+totaltoken* 1e-18)+chalk.yellow(' = '+totalValueToken* 1e-18+' $ (Without Price-Impact)'));
    //console.log(chalk.greenBright('Value: '+totalValue* 1e-18+' BNB (Without Price-Impact)'));
    //console.log(chalk.greenBright('Value $: '+totalValue* 1e-18+' $ (Without Price-Impact)'));
    console.log(chalk.greenBright('TOTAL VALUE = '+totalValue* 1e-18));
    console.log('================================');
  }
}

module.exports = { checkBalanceToken, checkBalanceBNB, totalBalances, getTokenVal, jinfo };