const ContentList = ({ setIsContent }) => {
  const handleClick = () => setIsContent(true);

  return (
    <ul>
      <li>
        <a href="#restricted-abc-123" onClick={handleClick}>
          Restricted-1 - Access code: 'abc-123'
        </a>
      </li>
      <li>
        <a href="#restricted-def-456" onClick={handleClick}>
          Restricted-2 - Access code: 'def-456'
        </a>
      </li>
      <li>
        <a href="#restricted-ghi-789" onClick={handleClick}>
          Restricted-3 - Access code: 'ghi-789'
        </a>
      </li>
    </ul>
  );
};

export default ContentList;
