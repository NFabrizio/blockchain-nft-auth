// This code started from https://github.com/alchemyplatform/nft-minter-tutorial/blob/main/nft-minter/src/Minter.js
import { useEffect, useState } from 'react';
import { mintNFT } from './utils/utils.js';

const Minter = ({ setStatus, status, walletAddress }) => {
  const [accessKey, setAccessKey] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [txHash, setTxHash] = useState('');

  const onMintPressed = async () => {
    const { status, txHash } = await mintNFT(accessKey);
    setStatus(status);
    setTxHash(txHash);

    window.contract.events
      .SendTokenId((err, result) => {
        console.log(err);
        console.log(result);
      })
      .on('data', event => {
        if (event && event.returnValues && event.returnValues.tokenId) {
          setTokenId(event.returnValues.tokenId);
        }
      })
      .on('error', event => console.error);
  };

  return (
    <div className="minter">
      <h1 id="title">NFT Authorization Minter</h1>
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
        Mint NFT Auth Token
      </button>
      {txHash && (
        <div className="hash-display">
          <p>Transaction hash: {txHash}</p>
        </div>
      )}
      {(tokenId || tokenId === 0) && (
        <div className="token-display">
          <p>
            Token ID: {tokenId}
            <br />
            <span style={{ color: 'red' }}>Take note of your token ID for accessing restricted content</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Minter;
