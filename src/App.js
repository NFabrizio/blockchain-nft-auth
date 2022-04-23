import { useEffect, useState } from 'react';
import { connectWallet, getCurrentWalletConnected, setupContract } from './utils/utils.js';
// import logo from './logo.svg';
import './App.css';
import Minter from './Minter';
import Restricted from './Restricted';

function App() {
  const minter = 'minter';
  const restricted = 'restricted';

  const [route, setRoute] = useState(minter);
  const [walletAddress, setWallet] = useState('');
  const [status, setStatus] = useState('');
  // const [accessKey, setAccessKey] = useState('');
  // const [txHash, setTxHash] = useState('');

  useEffect(() => {
    const getWallet = async () => {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
    };

    getWallet();

    if (window && window.location && window.location.hash && window.location.hash === `#${restricted}`) {
      setRoute(restricted);
    }

    const addContract = async () => {
      await setupContract();
    };

    addContract();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);

    addWalletListener();
  };

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
      {/* TODO: Add page with access code links to demonstrate different resources */}
      {route === restricted && <Restricted walletAddress={walletAddress} />}
    </div>
  );
}

export default App;
