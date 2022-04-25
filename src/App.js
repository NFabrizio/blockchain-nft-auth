import { useEffect, useState } from 'react';
import { connectWallet, getCurrentWalletConnected, getHash, setupContract } from './utils/utils.js';
import './App.css';
import Minter from './Minter';
import Restricted from './Restricted';

function App() {
  const minter = 'minter';
  const restricted = 'restricted';

  const [route, setRoute] = useState(minter);
  const [walletAddress, setWallet] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Get currently connected wallet address and any status message
    const getWallet = async () => {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
    };

    getWallet();

    const hash = getHash();

    // Set the rendered view based on the URL hash
    if (hash === restricted || hash.includes(`${restricted}-`)) {
      setRoute(restricted);
    }

    // Set up the contract on load so that it is available
    const addContract = async () => {
      await setupContract();
    };

    addContract();
  }, []);

  // Communicate with MetaMask when connect button is pressed to allow wallet connection
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);

    addWalletListener();
  };

  // Listen for events from MetaMask to handle changing of rendered elements
  const addWalletListener = () => {
    if (window.ethereum) {
      // TODO: Add listener to wipe walletAddress on disconnect event
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
          <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
            You must install MetaMask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      );
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="nav-group">
          <a className="app-link" href={`#${minter}`} onClick={() => setRoute(minter)}>
            Minter
          </a>
          <a className="app-link" href={`#${restricted}`} onClick={() => setRoute(restricted)}>
            Restricted Access
          </a>
        </div>
        {walletAddress.length > 0 ? (
          <button className="wallet-button">
            {'Connected: ' + String(walletAddress).substring(0, 6) + '...' + String(walletAddress).substring(38)}
          </button>
        ) : (
          <button className="wallet-button" onClick={connectWalletPressed}>
            <span>Connect Wallet</span>
          </button>
        )}
      </header>
      {route === minter && <Minter status={status} setStatus={setStatus} walletAddress={walletAddress} />}
      {route === restricted && <Restricted walletAddress={walletAddress} />}
    </div>
  );
}

export default App;
