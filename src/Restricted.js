import { useState } from 'react';
import { getHash, isAccessCodeMatch, isOwner } from './utils/utils.js';
import Access from './Access';
import ContentList from './ContentList';
import GateCheck from './GateCheck';

const Restricted = ({ walletAddress }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isContent, setIsContent] = useState(getHash().includes('restricted-'));
  const [isValidOwner, setIsValidOwner] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [status, setStatus] = useState('');

  const handleAuth = async () => {
    setIsValidOwner(false);
    setIsAuthorized(false);

    try {
      // Check if current wallet address is the owner of the token
      const isValidOwnerCheck = await isOwner(walletAddress, tokenId);
      console.log(`isValidOwnerCheck: ${isValidOwnerCheck}`);
      setIsValidOwner(isValidOwnerCheck);

      const hash = getHash();

      // Check if the access code of the token is the correct access code for the current resource
      const doesCodeMatch = await isAccessCodeMatch(hash.substr(11), tokenId);
      setIsAuthorized(doesCodeMatch);
    } catch (err) {
      setStatus('An error occurred during auth process. Please check that you have entered a valid token ID.');
    }
  };

  const BackArrow = () => (
    <a href="#restricted" onClick={() => setIsContent(false)}>
      ← Back to content list
    </a>
  );

  return (
    <div className="restricted">
      {isContent && <BackArrow />}
      <h1 id="title">Restricted Content</h1>
      {/* if #restricted -> <ContentList /> */}
      {!isContent && <ContentList setIsContent={setIsContent} />}
      {/* if #restricted-something -> <GateCheck /> */}
      {isContent && (!isValidOwner || !isAuthorized) && (
        <GateCheck handleAuth={handleAuth} setStatus={setStatus} setTokenId={setTokenId} status={status} />
      )}
      {/* TODO: Add messages for each combo of states */}
      {/* if isValidOwner && isAuthorized -> <AccessGranted /> */}
      {isContent && (isValidOwner || isAuthorized) && (
        <Access isAuthorized={isAuthorized} isValidOwner={isValidOwner} />
      )}
    </div>
  );
};

export default Restricted;
