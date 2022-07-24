// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IDEAS is ERC1155, Ownable {
    uint256 public constant IDEA1 = 0;
    uint256 public constant IDEA2 = 1;
    uint256 public constant IDEA3 = 2;
    uint256 public constant ESGROW =5;
    
    constructor() public ERC1155("gateway.pinata.cloud/ipfs/QmZqxsf4pLWrUZJTUXFD9qE8X9Ze5aUnTBmcKAMmktm72S") {
        _mint(msg.sender, IDEA1 , 1, "");
        _mint(msg.sender, IDEA2, 1, "");
        _mint(msg.sender, IDEA3, 1, "");
        _mint(msg.sender, ESGROW , 100*10**18, "");
        

         
         //ADD THE URL
         //USERS OWN THE NFT1155, ESGROW TOKEN 
    }
        function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
    
    //Comments for Thanh
    //https://gateway.pinata.cloud/ipfs/QmZqxsf4pLWrUZJTUXFD9qE8X9Ze5aUnTBmcKAMmktm72S - This is the gateway to the folder where i stored the NFT on pinata
    // 1. https://gateway.pinata.cloud/ipfs/QmZqxsf4pLWrUZJTUXFD9qE8X9Ze5aUnTBmcKAMmktm72S/Governance.png- Governance image
    //2. https://gateway.pinata.cloud/ipfs/QmZqxsf4pLWrUZJTUXFD9qE8X9Ze5aUnTBmcKAMmktm72S/Social.png -Social image
    //3. https://gateway.pinata.cloud/ipfs/QmZqxsf4pLWrUZJTUXFD9qE8X9Ze5aUnTBmcKAMmktm72S/Environment.jpeg
    // use brave browser to open the gateway doesn't open on chrome
    
// add the URL for each project

}
