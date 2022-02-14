import React, { useEffect } from 'react';

import NodeWalletConnect from "@walletconnect/node";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";

import Axios from 'axios';

function convertIdToStr(chainId) {
  switch (chainId) {
    case 1:
      return "eth";
    case 97:
      return "bsc";
    case 137:
      return "polygon";
    default:
      return "unknown";
  }
}

function App() {
  const [bgClr, setBgClr] = React.useState("white");

  useEffect(() => {
    async function fetchData() {

      // Create connector
      const walletConnector = new NodeWalletConnect(
        {
          bridge: "https://bridge.walletconnect.org",
        },
        {
          clientMeta: {
            description: "WalletConnect NodeJS Client",
            url: "https://nodejs.org/en/",
            icons: ["https://nodejs.org/static/images/logo.svg"],
            name: "WalletConnect",
          },
        }
      );
      
      // Check if connection is already established
      if (!walletConnector.connected) {
        // create new session
        walletConnector.createSession().then(() => {
          // get uri for QR Code modal
          const uri = walletConnector.uri;
          // display QR Code modal
          WalletConnectQRCodeModal.open(
            uri,
            () => {
              console.log("QR Code Modal closed");
            },
            true // isNode = true
          );
        });
      }

      // Subscribe to connection events
      walletConnector.on("connect", async (error, payload) => {
        if (error) {
          throw error;
        }
      
        // Close QR Code Modal
        WalletConnectQRCodeModal.close(
          true // isNode = true
        );
        
        // Get provided accounts and chainId
        const { accounts, chainId } = payload.params[0];

        // Get Nfts
        const { data } = await Axios.get('https://deep-index.moralis.io/api/v2/' + accounts[0] + '/nft/' + process.env.REACT_APP_TOKEN_ADDRESS + '?chain=' + convertIdToStr(chainId) + '&format=decimal', {headers : {"X-API-KEY": process.env.REACT_APP_MORALIS_KEY}});
        console.log(data);

        // Check if the Nft is owned by the user
        if (data && data.result && data.result.length !== 0)
          setBgClr("blue");
        else
          setBgClr("red");
      });

      walletConnector.on("session_update", async (error, payload) => {
        if (error) {
          throw error;
        }
      
        // Get updated accounts and chainId by the user
        const { accounts, chainId } = payload.params[0];

        // Get Nfts
        const { data } = await Axios.get('https://deep-index.moralis.io/api/v2/' + accounts[0] + '/nft/' + process.env.REACT_APP_TOKEN_ADDRESS + '?chain=' + convertIdToStr(chainId) + '&format=decimal', {headers : {"X-API-KEY": process.env.REACT_APP_MORALIS_KEY}});
        console.log(data);

        // Check if the Nft is owned by the user
        if (data && data.result && data.result.length !== 0)
          setBgClr("blue");
        else
          setBgClr("red");
      });

      walletConnector.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
      
        // Delete walletConnector
      });
    }
    fetchData();
  });
  return (
    <div
      style={{
        backgroundColor: bgClr,
        width: '100px',
        height: '100px'
      }}
    />
  );
}

export default App;
