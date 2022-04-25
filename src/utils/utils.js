// This code started from https://github.com/alchemyplatform/nft-minter-tutorial/blob/main/nft-minter/src/util/interact.js
const contractABI = require('../abis/authzkey-abi.json');
const Web3 = require('web3');

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545');

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
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
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
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install MetaMask, a virtual Ethereum wallet, in your browser.
            </a>
          </p>
        </span>
      )
    };
  }
};

export const mintNFT = async accessKey => {
  if (accessKey.trim() === '') {
    return {
      success: false,
      status: 'Please make sure all fields are completed before minting.'
    };
  }

  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods.mint(window.ethereum.selectedAddress, accessKey).encodeABI() //make call to NFT smart contract
  };

  //sign the transaction via MetaMask
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters]
    });

    return {
      success: true,
      status: `NFT auth token successfully minted`,
      txHash
    };
  } catch (error) {
    return {
      success: false,
      status: 'Something went wrong: ' + error.message
    };
  }
};

// Customized code from here on
export const setupContract = async () => {
  window.web3 = web3;
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  console.log(`Contract set up for ${contractAddress} in window`);
};

const checkAuthn = async tokenId => {
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods.ownerOf(tokenId).encodeABI() //make call to NFT smart contract
  };

  const res = await window.ethereum.request({
    method: 'eth_call',
    params: [transactionParameters]
  });

  return web3.eth.abi.decodeParameter('address', res);
};

const checkAuthz = async tokenId => {
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods.tokenURI(tokenId).encodeABI() //make call to NFT smart contract
  };

  const res = await window.ethereum.request({
    method: 'eth_call',
    params: [transactionParameters]
  });

  return web3.eth.abi.decodeParameter('string', res);
};

export const isOwner = async (address = '', tokenId) => {
  const authzAddress = (await checkAuthn(tokenId)) || '';

  return authzAddress.toLowerCase().trim() === address.toLowerCase().trim();
};

export const isAccessCodeMatch = async (accessCode = '', tokenId) => {
  const authzAccessCode = (await checkAuthz(tokenId)) || '';

  return authzAccessCode.trim() === accessCode.trim();
};

export const getHash = () => {
  let hash = '';

  if (window && window.location && window.location.hash && window.location.hash.substring) {
    hash = window.location.hash.substring(1);
  }

  return hash;
};
