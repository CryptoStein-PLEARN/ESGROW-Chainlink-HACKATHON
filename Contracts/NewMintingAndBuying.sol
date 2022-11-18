// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";

contract EsgrowNfts is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private proposalId;

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
    mapping(uint256 => string) private nftUris;
    address private superAdmin;

    struct Proposal {
        uint256 id;
        string name;
        uint256 time;
        string url;
    }

    mapping(uint256 => Proposal) proposals;
    mapping(address => uint256) ownerToProposal;
    mapping(address => bool) submittedProposal;
    mapping(uint256 => bool) approvedProposal;

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

    function setURI(uint256 tokenId, string memory newuri)
        public
        onlySuperAdmin
    {
        require(bytes(newuri).length != 0, "uri already assisgned");
        nftUris[tokenId] = newuri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return nftUris[tokenId];
    }

    function setBulkUri(string[] memory uris) public onlySuperAdmin {
        for (uint256 i = 0; i < uris.length; ) {
            nftUris[i] = uris[i];

            unchecked {
                ++i;
            }
        }
    }

    // proposal functions
    function submitProposal(string memory _name, string memory url) external returns (uint256) {
        require(!submittedProposal[msg.sender], "you already submitted a proposal");

        proposalId.increment();
        uint256 id = proposalId.current();
        uint256 time = block.timestamp;

        Proposal memory newProposal = Proposal(id, _name, time, url);

        proposals[id] = newProposal;
        ownerToProposal[msg.sender] = id;

        submittedProposal[msg.sender] = true;

        return id;
    }

    function approveProposal(uint256 _proposalId, address _marketplace) 
        external 
        onlySuperAdmin
    {
        approvedProposal[_proposalId] = true;

        uint256 tokenId = _proposalId + 20;
        
        // setURI(uint256 tokenId, string memory newuri)
        setURI(tokenId, proposals[_proposalId].url);

        // _mint(address to, uint256 id, uint256 amount, bytes memory data)
        _mint(_marketplace, tokenId, 1, "");
    }

    function getProposalId(address owner) external view returns (uint256) {
        return ownerToProposal[owner];
    }
}

contract NFTMarketplace is ERC1155Holder {
    address private superAdmin;
    address private treasury;
    
    mapping(uint256 => uint256) balances;

    bool locked;

    uint256[] nftPrices; //prices should be unit price to 6 decimals
    string[] nftUrls;

    uint256 decimalPosition = 1000000;

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


    function setNFTSUp(uint256[] memory prices, string[] memory uris)
        external
        onlySuperAdmin
    {
        require(!locked, "already setUp");
        esgrowNfts.setBulkUri(uris);
        nftPrices = prices;
        nftUrls = uris;
        locked = true;
    }

    function buyFraction(uint256 tokenId, uint256 amount) external payable {
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

    function getNFTBalance(uint256 tokenId) external view returns (uint256) {
        return esgrowNfts.balanceOf(address(this), tokenId);
    }

    function withDrawToTreasury() external onlySuperAdmin {
        payable(treasury).transfer(address(this).balance);
    }

    function getMyBalance(uint256 tokenId) external view returns (uint256) {
        return esgrowNfts.balanceOf(msg.sender, tokenId);
    }

    function getNFTPrice(uint256 nftId) external view returns (uint256) {
        return nftPrices[nftId];
    }

    function getNFTUrl(uint256 nftId) external view returns (string memory) {
        return esgrowNfts.uri(nftId);
    }

    function getTotalNftsMinted() external view returns (uint256) {
        return nftUrls.length;
    }

    function checkIfIsLocked() external view returns (bool) {
        return locked;
    }
}
