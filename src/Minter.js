// This code started from https://github.com/alchemyplatform/nft-minter-tutorial/blob/main/nft-minter/src/Minter.js
import { useEffect, useState } from 'react';
import { mintNFT } from './utils/utils.js';

const Minter = ({ setStatus, status, walletAddress }) => {
  const [accessKey, setAccessKey] = useState('');
  const [txHash, setTxHash] = useState('');

  // useEffect(() => {
  //   window.contract.events.allEvents((err, result) => console.log(result));
  // }, []);

  const onMintPressed = async () => {
    // TODO: Figure out how to get token ID after minting for user
    const { status, txHash } = await mintNFT(accessKey);
    setStatus(status);
    setTxHash(txHash);
    window.contract.events.SendTokenId((err, result) => {
      console.log(err);
      console.log(result);
    });
    // window.web3.eth.subscribe
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
        Mint NFT
      </button>
    </div>
  );
};

export default Minter;
