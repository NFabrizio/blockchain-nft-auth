# blockchain-nft-auth

An app to mint NFTs with authorization codes built-in and to use the blockchain to authenticate users before providing them access to digital resources.

_Authors_: [Nick Fabrizio](https://github.com/NFabrizio)

Project is written in Solidity, NodeJS and React.

## Environment Set Up

1. Install NodeJS and NPM.
2. Install Ganache.  
   https://trufflesuite.com/docs/ganache/quickstart.html
3. Install Truffle.  
   `npm install -g truffle`
4. Install the Metamask browser extension.
5. Npm install
6. Set up Alchemy account and get API key.

## Usage

- Deploy contract to Ganache network
  - truffle compile
  - truffle migrate
  - Copy contract address for AuthzKey migration
- Add values to .env
- Import Ganache wallet to Metamask
- Mint NFTs
- Describe restricted content link format

## Docs
