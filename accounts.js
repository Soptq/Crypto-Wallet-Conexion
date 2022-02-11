const ethers = require('ethers');
const { accountRangeMax } = require('./parameters');
require('dotenv').config();



//const provider = new ethers.providers.WebSocketProvider('wss://bsc-ws-node.nariox.org:443');
const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
//const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/');


//First address of this mnemonic must have enough BNB to pay for tx fess
const mnemonic = process.env.MNEMONIC //your memonic;

let wallets = [];
for (let i = 0; i < accountRangeMax; i++) {
  wallets[i] = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/`+i);

}

let accounts = [];
for (let i = 0; i < wallets.length; i++) {
  accounts[i] = wallets[i].connect(provider);
}

module.exports = { accounts, provider };