// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

contract AuthzKey is ERC721Full {
  string[] public authZKeys;
  address payable wallet;

  constructor(address payable _wallet) ERC721Full("AuthzKey", "AUTHZ_KEY") public {
    wallet = _wallet;
    /* accessCode = _accessCode; */
  }

  function transferAuthzKey(string memory _authZKey) public payable {
    this.mint(_authZKey);
    // uint publisherCut = 500000000000000000;
    // uint authorCut = 500000000000000000;

    // wallet.transfer(publisherCut);
    // _authorWallet.transfer(authorCut);
  }

  function mint(string memory authZKey) public {
    //Generate and add it
    uint _id = authZKeys.push(authZKey);
    //Call the mint function
    _mint(msg.sender, _id);
  }
}