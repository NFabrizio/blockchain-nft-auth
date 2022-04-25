// This code started from https://github.com/alchemyplatform/nft-minter-tutorial/blob/main/nft-minter/src/util/interact.js
const contractABI = require('../abis/authzkey-abi.json');
const Web3 = require('web3');

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545');

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Send request to connect wallets and use the first one in the array to display as the connected wallet in the UI
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
      // Send the request to get any connected wallets and use the first one in the array
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
  // If no access key provided, don't mint a token
  if (accessKey.trim() === '') {
    return {
      success: false,
      status: 'Please make sure all fields are completed before minting.'
    };
  }

  // Set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods.mint(window.ethereum.selectedAddress, accessKey).encodeABI() //make call to NFT smart contract
  };

  // Send the transaction using MetaMask
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

// Customized code from here on down

export const setupContract = async () => {
  window.web3 = web3;
  // Add configured contract to window object for easy reference later
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  console.log(`Contract set up for ${contractAddress} in window`);
};

const checkAuthn = async tokenId => {
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    // Request owner of token for verification
    data: window.contract.methods.ownerOf(tokenId).encodeABI()
  };

  const res = await window.ethereum.request({
    method: 'eth_call',
    params: [transactionParameters]
  });

  // Response is returned as hashed value, so decode it before sending it to the UI
  return web3.eth.abi.decodeParameter('address', res);
};

const checkAuthz = async tokenId => {
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    // Request token metadata
    data: window.contract.methods.tokenURI(tokenId).encodeABI()
  };

  const res = await window.ethereum.request({
    method: 'eth_call',
    params: [transactionParameters]
  });

  // Response is returned as hashed value, so decode it before sending it to the UI
  return web3.eth.abi.decodeParameter('string', res);
};

// Check contract data and return boolean to UI
export const isOwner = async (address = '', tokenId) => {
  const authzAddress = (await checkAuthn(tokenId)) || '';

  return authzAddress.toLowerCase().trim() === address.toLowerCase().trim();
};

// Check contract data and return boolean to UI
export const isAccessCodeMatch = async (accessCode = '', tokenId) => {
  const authzAccessCode = (await checkAuthz(tokenId)) || '';

  return authzAccessCode.trim() === accessCode.trim();
};

// Grab window location hash and remove # symbol
export const getHash = () => {
  let hash = '';

  if (window && window.location && window.location.hash && window.location.hash.substring) {
    hash = window.location.hash.substring(1);
  }

  return hash;
};
