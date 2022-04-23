// This code started from https://github.com/alchemyplatform/nft-minter-tutorial/blob/main/nft-minter/src/util/interact.js
const contractABI = require('../abis/authzkey-abi.json');
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');

const alchemyUrl = process.env.REACT_APP_ALCHEMY_KEY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const web3 = createAlchemyWeb3(alchemyUrl);

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

  // //make metadata
  // const metadata = new Object();
  // metadata.name = name;
  // metadata.description = description;

  // window.contract = await new web3.eth.Contract(contractABI, contractAddress);

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

    // return {
    //   success: true,
    //   status: 'Check your transaction using transaction hash: ' + txHash
    // };

    // const transactionDetails = await web3.eth.getTransactionReceipt(txHash);
    //
    // console.log(transactionDetails);

    return {
      success: true,
      status: 'Check your transaction using transaction hash: ' + txHash,
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
  window.web3.setWriteProvider('ws://127.0.0.1:7545');
};

export const getTokens = async address => {
  console.log('web3');
  console.log(web3);
  // console.log(web3.alchemy);
  console.log(`address: ${address}`);
  // return await web3.alchemy.getNfts({ owner: address });
  // return await web3.eth.getTransactionReceipt(address);
  // return await window.contract.methods.balanceOf(address).send({ from: address });

  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods.ownerOf('9').encodeABI() //make call to NFT smart contract
  };

  // const req = await window.ethereum.request({
  // return await window.ethereum.request({
  //   method: 'eth_getBalance',
  //   params: [window.ethereum.selectedAddress, 'latest']
  // });
  const res = await window.ethereum.request({
    method: 'eth_call',
    params: [transactionParameters]
  });

  return web3.eth.abi.decodeParameter('address', res);
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

// TODO: Add method to return window.location.hash with hash symbol removed
