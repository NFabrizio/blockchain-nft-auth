import { useState } from 'react';
import { isAccessCodeMatch, isOwner } from './utils/utils.js';

const Restricted = ({ walletAddress }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isValidOwner, setIsValidOwner] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [status, setStatus] = useState('');

  const handleAuth = async () => {
    const isValidOwnerCheck = await isOwner(walletAddress, tokenId);
    console.log(`isValidOwnerCheck: ${isValidOwnerCheck}`);
    setIsValidOwner(isValidOwnerCheck);

    const doesCodeMatch = await isAccessCodeMatch('def456', tokenId);
    setIsAuthorized(doesCodeMatch);
  };

  return (
    <div className="restricted">
      <h1 id="title">Restricted Content</h1>
      {(!isValidOwner || !isAuthorized) && (
        <div className="authz-form">
          <form>
            <p>Enter Token ID to Continue</p>
            <input type="text" placeholder="e.g. your-token-id" onChange={event => setTokenId(event.target.value)} />
          </form>
          {status && (
            <p id="status" style={{ color: 'red' }}>
              {status}
            </p>
          )}
          <button id="checkAuthz" onClick={handleAuth}>
            Check Authorization
          </button>
        </div>
      )}
      {/* TODO: Add messages for each combo of states */}
      {isValidOwner && <h2>Valid Owner</h2>}
      {isValidOwner && isAuthorized && <h2>Authorized</h2>}
    </div>
  );
};

export default Restricted;
