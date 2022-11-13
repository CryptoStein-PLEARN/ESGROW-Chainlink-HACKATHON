// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";

contract EsgrowNfts is ERC1155 {
    uint256 public constant IDEA1 = 0;
    uint256 public constant IDEA2 = 1;
    uint256 public constant IDEA3 = 2;
    uint256 public constant IDEA4 = 3;
    uint256 public constant IDEA5 = 4;
    uint256 public constant IDEA6 = 5;
    uint256 public constant IDEA7 = 6;
    uint256 public constant IDEA8 = 7;
    uint256 public constant IDEA9 = 8;
    uint256 public constant IDEA10 = 9;

    uint256 public constant Fraction1 = 11;
    uint256 public constant Fraction2 = 12;
    uint256 public constant Fraction3 = 13;
    uint256 public constant Fraction4 = 14;
    uint256 public constant Fraction5 = 15;
    uint256 public constant Fraction6 = 16;
    uint256 public constant Fraction7 = 17;
    uint256 public constant Fraction8 = 18;
    uint256 public constant Fraction9 = 19;
    uint256 public constant Fraction10 = 20;

    uint256 amount;
    address tokenAddress;
    mapping(uint => string) private nftUris;
    address private superAdmin;

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, " not authorized");
        _;
    }

    constructor()
        ERC1155(
            "gateway.pinata.cloud/ipfs/QmZqxsf4pLWrUZJTUXFD9qE8X9Ze5aUnTBmcKAMmktm72S"
        )
    {
        _mint(msg.sender, IDEA1, 1, "");
        _mint(msg.sender, IDEA2, 1, "");
        _mint(msg.sender, IDEA3, 1, "");
        _mint(msg.sender, IDEA4, 1, "");
        _mint(msg.sender, IDEA5, 1, "");
        _mint(msg.sender, IDEA6, 1, "");
        _mint(msg.sender, IDEA7, 1, "");
        _mint(msg.sender, IDEA8, 1, "");
        _mint(msg.sender, IDEA9, 1, "");
        _mint(msg.sender, IDEA10, 1, "");

        _mint(msg.sender, Fraction1, 1000000 ether, "");
        _mint(msg.sender, Fraction2, 1000000 ether, "");
        _mint(msg.sender, Fraction3, 1000000 ether, "");
        _mint(msg.sender, Fraction4, 1000000 ether, "");
        _mint(msg.sender, Fraction5, 1000000 ether, "");
        _mint(msg.sender, Fraction6, 1000000 ether, "");
        _mint(msg.sender, Fraction7, 1000000 ether, "");
        _mint(msg.sender, Fraction8, 1000000 ether, "");
        _mint(msg.sender, Fraction9, 1000000 ether, "");
        _mint(msg.sender, Fraction10, 1000000 ether, "");

        superAdmin = msg.sender;
    }

    function setURI(uint tokenId, string memory newuri) public onlySuperAdmin {
        require(bytes(newuri).length == 0, "uri already assisgned");
        nftUris[tokenId] = newuri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return nftUris[tokenId];
    }

    function setBulkUri(string[] memory uris) public onlySuperAdmin {
        for (uint i=0; i < uris.length; ) {
            nftUris[i] = uris[i];

            unchecked {
                ++i;
            }
        }
    }
}

contract NFTMarketplace is ERC1155Holder {
    address private superAdmin;
    address private treasury;
    mapping(uint => uint) balances;
    bool locked;

    uint[] nftPrices; //prices should be unit price to 6 decimals
    string[] nftUrls;

    uint decimalPosition = 1000000;

    EsgrowNfts esgrowNfts;

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "no authorized");
        _;
    }

    constructor(address _treasury) {
        esgrowNfts = new EsgrowNfts();
        superAdmin = msg.sender;
        treasury = _treasury;
        locked = false;
    }

    function setNFTSUp(uint[] memory prices, string[] memory uris)
        external
        onlySuperAdmin
    {
        require(!locked,"already setUp");
        esgrowNfts.setBulkUri(uris);
        nftPrices = prices;
        nftUrls = uris;
        locked = true;

    }

    function buyFraction(uint tokenId, uint amount) external payable {
        require(tokenId >= 11, "token not a fraction");
        require(
            msg.value / (amount * 10**12) >= nftPrices[tokenId - 11],
            "provided funds not enough for amount"
        );
        require(
            esgrowNfts.balanceOf(address(this), tokenId) >= amount,
            "amount exceeds remaining tokens"
        );
        esgrowNfts.safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount * 10**18,
            ""
        );
        balances[tokenId] += msg.value;
    }

    function getNFTBalance(uint tokenId) external view returns (uint) {
        return esgrowNfts.balanceOf(address(this), tokenId);
    }

    function withDrawToTreasury() external onlySuperAdmin {
        payable(treasury).transfer(address(this).balance);
    }

    function getMyBalance(uint tokenId) external view returns (uint) {
        return esgrowNfts.balanceOf(msg.sender, tokenId);
    }

    function getNFTPrice(uint nftId) external view returns(uint){
        return nftPrices[nftId];
    }
    
    function getNFTUrl(uint nftId) external view returns(string memory){
      return esgrowNfts.uri(nftId);
    }

    function getTotalNftsMinted() external view returns(uint){
        return nftUrls.length;
    }

    function checkIfIsLocked() external view returns(bool){
        return locked;
    }
}
