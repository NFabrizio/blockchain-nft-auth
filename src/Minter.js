import { useEffect, useState } from 'react';
import { connectWallet, getCurrentWalletConnected } from './utils/utils.js';

const Minter = () => {
  const [walletAddress, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');

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
          setStatus('Write a message in the text-field above.');
        } else {
          setWallet('');
          setStatus('Connect to MetaMask using the top right button.');
        }
      });
    } else {
      setStatus(
        <p>
          {' '}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install MetaMask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      );
    }
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
      <p>Simply add your asset's link, name, and description, then press "Mint."</p>
      <form>
        <h2>Name: </h2>
        <input type="text" placeholder="e.g. My first NFT!" onChange={event => setName(event.target.value)} />
        <h2>Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={event => setDescription(event.target.value)}
        />
        <p id="status" style={{ color: 'red' }}>
          {status}
        </p>
      </form>
      <button id="mintButton" onClick={() => {}}>
        Mint NFT
      </button>
    </div>
  );
};

export default Minter;
