# blockchain-nft-auth

An app to demonstrate minting NFTs with authorization codes included in their metadata and managing access control to digital resources based on token ownership and token metadata. The purpose of this app is to provide a proof of concept for using blockchain to manage user authentication and authorization in tandem (i.e., not only does a particular access code authorize a user to access an object, but does the currently authenticated user have permissions to use this access code).

_Authors_: [Nick Fabrizio](https://github.com/NFabrizio)

This project is written in Solidity and React. It uses Truffle, Ganache and Web3 for contract communications, and MetaMask for managing wallet interactions.

## Environment Set Up

1. Install NodeJS and NPM.  
   https://nodejs.org/en/download/package-manager/#macos

   - Recommended versions:
     - NodeJS: v14.18.2
     - NPM: 6.14.15
   - Recommended OS: macOS Big Sur 11.6.4

2. Install Truffle.  
   `npm install -g truffle`
3. Install the MetaMask browser extension.  
   _This project requires that you use an existing MetaMask account or create a new one_

## Usage

1. Install project dependencies.
   1. In a terminal window on your local machine, navigate to the root directory for this project and run the following command:  
      `npm install`
2. Start a local blockchain.
   1. In a terminal window on your local machine, navigate to the root directory for this project and run the following command:  
      `npm run ganache`  
      _For simplicity and use in later steps, leave this process running in this tab in your terminal_
3. Add the local Ganache blockchain to MetaMask.
   _Detailed instructions can be found at https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC_
   1. In the MetaMask Settings -> Networks -> Add a network tab, use the following information:
      - Network Name: Something identifiable (e.g., Ganache Local)
      - New RPC URL: The value from your Ganache network logged as "RPC listening on" (e.g., http://127.0.0.1:7545)
      - Chain ID: The value from your Ganache network logged as "Chain Id" (e.g., 1337)
4. Import local blockchain wallet to MetaMask.
   _Detailed instructions can be found at https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account_
   1. In the MetaMask browser extension Import tab, use the following information:
      - Select Type: Select "Private Key"
      - Paste your private key string here: The value from your Ganache network logged as "Private Keys" for the account you would like to use
5. Deploy the Solidity contract to the local blockchain.
   1. In a NEW terminal window on your local machine, navigate to the root directory for this project and run the following command:  
      `npm run contract:deploy`  
      In the terminal, you should see the contract compile and deploy successfully with log messages for the deployment of initial_migration and authzkey_migration.
6. Create a .env file.
   1. In a terminal window on your local machine, navigate to the root directory of this project and create a file named .env using the following command:  
      `touch .env`
7. Add the deployed contract address to the .env file.
   1. In your terminal window on your local machine, copy the contract address for the authzkey_migration from step 3 above.
   2. In a file editor of your choice, open the .env file and add the following:  
      `REACT_APP_CONTRACT_ADDRESS = "deployed_contract_address"`  
      _Replace deployed_contract_address above with the value of the contract address for your deployed contract_
8. Run the application.
   1. In a terminal window on your local machine, navigate to the root directory for this project and run the following command:  
      `npm start`  
      _This should start the application and automatically open it in a new browser tab. If this does not happen, you should be able to access the application at localhost:3000_
9. Mint NFTs.
   1. The default page for the application is the NFT minter. This is the view that should be rendered when you visit localhost:3000.
   2. Connect your Ganache wallet to the demo app by clicking the "Connect" button in the upper right corner of the screen.  
      _Clicking the connect button should cause MetaMask to open asking for confirmation and which wallet you would like to connect_
   3. Enter any string in the "Access Key:" field.
   4. Click the "Mint NFT Auth Token" button.
      _After clicking the button, you should see a transaction hash rendered to the screen immediately and a message with the token ID after 30-60 seconds_
10. Access restricted content.
11. Click the "Restricted Content" navigation link near the upper left corner of the screen.
    _This should navigate you to a view with a list of several links to restricted digital content_
12. Click on any of the restricted content links.
    _This should navigate you to a restricted content page and render a challenge form asking for a token ID_
13. Enter a token ID in the field and click the "Check Authorization" button.
    - If you are the owner of the token with that ID, you should see a message stating that you are the valid owner.
    - If the token contains the correct access code for the digital resource you are trying to view, you should also see a message stating that you are authorized.
    - Each link to a digital resource on the Restricted Content view shows the access code required to view that resource.
    - To receive the authorized message for that resource, mint a token using the access code specific to that particular resource.
    - The restricted content resource access codes are the string values inside of the single quotation marks and do not include the quotation marks.

## Test Cases

1. Use an owned token with appropriate access code to try to gain access to a resource.
   1. Ensure a Ganache wallet address is connected to the app using MetaMask.
   2. Mint an NFT Auth token using an access code for one of the restricted content views (e.g., abc-123).
   3. Record the token ID returned from the minter.
   4. Navigate to the Restricted Content view and click the appropriate link based on the access code used in step 2 above.
      _The token ID form should be displayed._
   5. Enter the token ID from step 3 above.
   6. Click the "Check Authorization" button.
   - Expected state: "Valid owner" message and "Authorized" message
2. Use a non-owned token with appropriate access code to try to gain access to a resource.
   1. Ensure a Ganache wallet address is connected to the app using MetaMask.
   2. Mint an NFT Auth token using an access code for one of the restricted content views (e.g., abc-123).
   3. Record the token ID returned from the minter.
   4. Change to a different Ganache wallet address using MetaMask.
      _This will require importing a separate Ganache wallet address to MetaMask. For instructions, see step 4 under Usage above._
   5. Navigate to the Restricted Content view and click the appropriate link based on the access code used in step 2 above.
      _The token ID form should be displayed._
   6. Enter the token ID from step 3 above.
   7. Click the "Check Authorization" button.
   - Expected state: Empty state with no messages, only token ID form is displayed
3. Use an owned token with inappropriate access code to try to gain access to a resource.
   1. Ensure a Ganache wallet address is connected to the app using MetaMask.
   2. Mint an NFT Auth token using an access code for one of the restricted content views (e.g., abc-123).
   3. Record the token ID returned from the minter.
   4. Navigate to the Restricted Content view and click the appropriate link based on the access code used in step 2 above.
      _The token ID form should be displayed._
   5. Enter the token ID from step 3 above.
   6. Click the "Check Authorization" button.
   - Expected state: "Valid owner" message with no authorized message
4. Use a non-owned token with inappropriate access code to try to gain access to a resource.
   1. Ensure a Ganache wallet address is connected to the app using MetaMask.
   2. Mint an NFT Auth token using an access code for one of the restricted content views (e.g., abc-123).
   3. Record the token ID returned from the minter.
   4. Change to a different Ganache wallet address using MetaMask.
      _This will require importing a separate Ganache wallet address to MetaMask. For instructions, see step 4 under Usage above._
   5. Navigate to the Restricted Content view and click the appropriate link based on the access code used in step 2 above.
      _The token ID form should be displayed._
   6. Enter the token ID from step 3 above.
   - Expected state: Empty state with no messages, only token ID form is displayed
5. Use a token ID that does not exist in the system to try to gain access to a resource.
   1. Navigate to the Restricted Content view and click any link.
      _The token ID form should be displayed._
   2. Enter a token ID with a number higher than any tokens created in the test cases above.
   3. Click the "Check Authorization" button.
   - Expected state: Token ID form is displayed with error message stating that the request was not able to be processed.

## Future Work and Considerations

As mentioned above, this application is meant to be a proof of concept (POC) for minting and using NFTs to authenticate and authorize individual users in order to control access to objects. Given that it is a POC, it should be considered only a first step to more rigorous access control models and methods using NFTs and blockchain. The following are some considerations and potential next steps.

- Create a system of unique access codes by having the contract generate random UUIDs as the access codes rather than allowing the user to select the access code.
- Create a system of one-time use access codes by having the contract burn/destroy a token when a lookup is performed on its metadata
- Encrypt access codes before storing them in token metadata to increase the difficulty of attacks on systems adopting this approach
- Storing token metadata in an external service to increase the difficulty of attacks on systems adopting this approach
- Exploring the implementation of various access control models (e.g., mandatory, role-based, attribute-based, etc.) using NFTs
- Exploring the use of NFTs to achieve integrity and/or confidentiality with regard to access control
