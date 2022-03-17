// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AuthzKey is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  string[] public authZKeys;
  string private _baseURL = "http://storage.some-url.com/";

  constructor() ERC721("AuthzKey", "AUTHZ_KEY") {
  }

  function transferAuthzKey(address _newOwner, string memory _authZKey) public returns (uint256) {
    return this.mint(_newOwner, _authZKey);
  }

  function mint(address newOwner, string memory authZKey) public returns (uint256) {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    authZKeys.push(authZKey);

    string memory tokenURI = string(abi.encodePacked(_baseURL, newItemId, ".json")); 

    // Create json file with content as authzKey with proper name and put it at _baseURL
    // When token URI is accessed, check token owner before returning content
    // Burn token after it is accessed

    //Call the mint function
    _mint(newOwner, newItemId);
    _setTokenURI(newItemId, tokenURI);

    return newItemId;
  }
}