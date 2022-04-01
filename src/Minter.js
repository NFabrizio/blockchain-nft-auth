import { useEffect, useState } from 'react';
import { connectWallet } from './utils/utils.js';

const Minter = () => {
  const [walletAddress, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
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
      </form>
      <button id="mintButton" onClick={() => {}}>
        Mint NFT
      </button>
      <p id="status" style={{ color: 'red' }}>
        {status}
      </p>
    </div>
  );
};

export default Minter;
