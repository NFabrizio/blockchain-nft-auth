// This code started from https://github.com/alchemyplatform/nft-minter-tutorial/blob/main/nft-minter/src/Minter.js
import { useEffect, useState } from 'react';
import { connectWallet, getCurrentWalletConnected, mintNFT } from './utils/utils.js';

const Minter = () => {
  const [walletAddress, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [accessKey, setAccessKey] = useState('');

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);

    addWalletListener();
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus('Connected to wallet');
        } else {
          setWallet('');
          setStatus('Connect to MetaMask using the top right button.');
        }
      });
    } else {
      setStatus(
        <p>
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install MetaMask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      );
    }
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(accessKey);
    setStatus(status);
  };

  return (
    <div className="minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          'Connected: ' + String(walletAddress).substring(0, 6) + '...' + String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">NFT Minter</h1>
      <p>Simply add your asset's access key, then press "Mint."</p>
      <form>
        <h2>Access Key: </h2>
        <input
          type="text"
          placeholder="e.g. your-access-key-123"
          onChange={event => setAccessKey(event.target.value)}
        />
        <p id="status" style={{ color: 'red' }}>
          {status}
        </p>
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
    </div>
  );
};

export default Minter;
