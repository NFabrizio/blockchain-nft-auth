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

export const mintNFT = async accessKey => {
  if (accessKey.trim() == '') {
    return {
      success: false,
      status: 'Please make sure all fields are completed before minting.'
    };
  }

  // //make metadata
  // const metadata = new Object();
  // metadata.name = name;
  // metadata.description = description;

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

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
      status: 'Check your transaction using transaction hash: ' + txHash
    };
  } catch (error) {
    return {
      success: false,
      status: 'Something went wrong: ' + error.message
    };
  }
};
