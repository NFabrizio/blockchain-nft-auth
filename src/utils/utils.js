// require('dotenv').config();
const contractABI = require('../abis/authzkey-abi.json');
// const { createAlchemyWeb3 } = require('@alch/alchemy-web3');

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
// const web3 = createAlchemyWeb3(alchemyKey);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const obj = {
        status: 'Connected to wallet',
        address: addressArray[0]
      };
      return obj;
    } catch (err) {
      return {
        address: '',
        status: err.message
      };
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install MetaMask, a virtual Ethereum wallet, in your browser.
            </a>
          </p>
        </span>
      )
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts'
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: 'Connected to wallet'
        };
      } else {
        return {
          address: '',
          status: 'Connect to MetaMask using the top right button.'
        };
      }
    } catch (err) {
      return {
        address: '',
        status: err.message
      };
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            {' '}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install MetaMask, a virtual Ethereum wallet, in your browser.
            </a>
          </p>
        </span>
      )
    };
  }
};

export const mintNFT = async (name, description) => {
  if (name.trim() == '' || description.trim() == '') {
    return {
      success: false,
      status: 'Please make sure all fields are completed before minting.'
    };
  }
};
