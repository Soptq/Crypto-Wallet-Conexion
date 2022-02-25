import React, {useEffect} from 'react';

import WalletConnectProvider from "@walletconnect/web3-provider";

const Web3 = require('web3');

function App() {
    const [web3, setWeb3] = React.useState(null)
    const [connected, setConnected] = React.useState(false)
    const [verified, setVerified] = React.useState(false)
    const [haveToken, setHaveToken] = React.useState(false)

    const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS
    const tokenABI = JSON.parse(process.env.REACT_APP_TOKEN_ABI)

    const verifyUser = async (address) => {
        if (verified)
            return true
        // Requesting sign
        const message = `I am the owner of the address ${address}`
        const signedMessage = await web3.eth.personal.sign(web3.utils.utf8ToHex(message), address);
        if (address === web3.eth.accounts.recover(message, signedMessage)) {
            setVerified(true)
            return true
        }
        return false
    }

    const checkSpecifiedToken = async (address, chainId, tokenAddress) => {
        const contract = new web3.eth.Contract(tokenABI, tokenAddress);
        contract.methods.balanceOf(address).call((error, balance) => {
            if (error)
                throw error
            if (balance > 0) {
                setHaveToken(true)
            } else {
                setHaveToken(false)
            }
        });
    }

    useEffect(() => {
        if (!web3 || !connected)
            return

        const accountsChangedCallback = async (accounts) => {
            const chainId = await web3.eth.getChainId();
            await verifyUser(accounts[0])
            await checkSpecifiedToken(accounts[0], chainId, tokenAddress)
        }

        const chainChangedCallback = async (chainId) => {
            window.location.reload();
        }

        const disconnectCallback = (data) => {
            setConnected(false)
        }

        web3.givenProvider.on('accountsChanged', accountsChangedCallback);
        web3.givenProvider.on('chainChanged', chainChangedCallback);
        web3.givenProvider.on("disconnect", disconnectCallback);

        (async () => {
            const address = (await web3.eth.getAccounts())[0];
            const chainId = await web3.eth.getChainId();
            await verifyUser(address);
            await checkSpecifiedToken(address, chainId, tokenAddress);

            (new web3.eth.Contract(tokenABI, tokenAddress)).events.Transfer({
                fromBlock: 0
            }).on('data', event => {
                web3.eth.getTransaction(event.transactionHash)
                    .then(function (transaction) {
                        if (transaction.from === address || transaction.to === address) {
                            checkSpecifiedToken(address, chainId, tokenAddress)
                        }
                    })
            })
        })()

        return () => {
            web3.givenProvider.removeListener('accountsChanged', accountsChangedCallback);
            web3.givenProvider.removeListener('chainChanged', chainChangedCallback);
            web3.givenProvider.removeListener("disconnect", disconnectCallback);
        }
    }, [web3, connected, verifyUser, checkSpecifiedToken, tokenAddress]);

    const initWalletConnect = async () => {
        //  Create WalletConnect Provider
        const provider = new WalletConnectProvider({
            infuraId: process.env.REACT_APP_INFURA_ID,
        });

        //  Enable session (triggers QR Code modal)
        await provider.enable();
        setConnected(true)
        setWeb3(new Web3(provider));
    }

    const initMetamask = async () => {
        if (typeof window.ethereum === 'undefined') {
            console.log('MetaMask is not installed!');
            return
        }

        await window.ethereum.request({method: 'eth_requestAccounts'});
        setConnected(true)
        setWeb3(new Web3(window.ethereum));
    }

    return (
        <div>
            <p>Connected: {connected.toString()}; Verified: {verified.toString()}; Have NFT: {haveToken.toString()}</p>
            <hr/>
            <p>Have access to JWT? {(connected && verified && haveToken).toString()}</p>
            <hr/>
            <button onClick={initWalletConnect}>Connect to WalletConnect</button>
            <button onClick={initMetamask}>Connect to Metamask</button>
            <hr/>
            <p>Please check the web console for messages</p>
        </div>
    );
}

export default App;
