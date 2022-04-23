const GateCheck = ({ handleAuth, setStatus, setTokenId, status }) => {
  return (
    <div className="authz-form">
      <form>
        <p>Enter Token ID to Continue</p>
        <input
          type="text"
          placeholder="e.g. your-token-id"
          onChange={event => {
            setStatus('');
            setTokenId(event.target.value);
          }}
        />
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
  );
};

export default GateCheck;
