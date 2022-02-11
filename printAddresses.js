const ethers = require('ethers');
var Web3 = require('web3');
require('dotenv').config();
const chalk = require('chalk');
var Contract = require('web3-eth-contract');

// set provider for all later instances to use
Contract.setProvider('wss://bsc-ws-node.nariox.org:443');




var web3 = new Web3(Web3.givenProvider || 'wss://bsc-ws-node.nariox.org:443');
//First address of this mnemonic must have enough BNB to pay for tx fess
const mnemonic = process.env.MNEMONIC //your memonic;
const provider = new ethers.providers.WebSocketProvider('wss://bsc-ws-node.nariox.org:443');






let wallets = [];
for (let i = 0; i < 30; i++) {
  wallets[i] = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/`+i);
}

let accounts = [];
for (let i = 0; i < wallets.length; i++) {
  accounts[i] = wallets[i].connect(provider);
}

const getVolume = async () => {

  const abi = [
    "event Transfer(address indexed src, address indexed dst, uint val)",
    "event Swap(address indexed sender,uint amount0In,uint amount1In,uint amount0Out,uint amount1Out, address indexed to)"
  ];
  
  contract = new Contract(abi,'0x10ED43C718714eb63d5aA57B78B54704E256024E');
  // List all token transfers *from* myAddress
  //let events = await contract.filters.Swap(accounts[4].address)
  //console.log(events)
  contract.events.allE({
    filter: {sender: '0x2d0379fDda6946F58C84b57fe080CF6B7988A1B7'}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0,
    toBlock: 'latest'
}, function(error, events){ console.log(events); })
.then(function(events){
    console.log(events) // same results as the optional callback above
});
}



const printAddress = async () => {
  for (let i = 0; i < accounts.length; i++) {
    //console.log(accounts[i].address); //print all addresses up to length
    //Print all addresses of mnemonic up to length with BNB and Token Balance
    //let bnbBal = await checkBalanceBNB(accounts[i].address);
    //let tokenBal = await checkBalanceToken(addresses.tokenToTrade, accounts[i].address);
    //console.log('Account'+i+': '+accounts[i].address)
    console.log('"'+accounts[i].address+'",')
    //const num = i + 100000; 
    //console.log(num+',')
  }
}

printAddress();
//getVolume();
