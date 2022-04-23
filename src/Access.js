const Access = ({ isAuthorized, isValidOwner }) => {
  return (
    <>
      {isValidOwner && <h2>Valid Owner</h2>}
      {isValidOwner && isAuthorized && <h2>Authorized</h2>}
    </>
  );
};

export default Access;
