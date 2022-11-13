const main = async () => {
  // all contracts
  const ManagementContract = await ethers.getContractFactory("NewManagement");
  const NFTMintingContract = await ethers.getContractFactory("EsgrowNfts");
  const MarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
  const ManiTokenContract = await ethers.getContractFactory("MANI");

  const [deployer] = await ethers.getSigners();

  const MANIInstance = await ManiTokenContract.deploy(180);
  const MarketplaceInstance = await MarketplaceContract.deploy(deployer.address);
  const ManagementInstance = await ManagementContract.deploy(50, MANIInstance.address, 180, 180);
  const NftInstance = await NFTMintingContract.deploy();

  // set vote contract
  await MANIInstance.setVoteContract(ManagementInstance.address);

  console.log(`Contract Deployed by Account %s \n \n`, deployer.address);
  console.log(`NFTMinting Contract Address %s`, NftInstance.address);
  console.log(`Marketplace Contract address %s`, MarketplaceInstance.address);
  console.log(`Management Contract Address %s`, ManagementInstance.address);
  console.log(`MANI Contract Address %s`, MANIInstance.address);
};


// Contract Deployed by Account 0xE700b2C6184583c7E8863970Dd128d680F751A09
// NFTMinting Contract Address 0xB01f9CE55D403A447bc12E8Fcd82B671320BE163
// Marketplace Contract address 0x97842618A8687A15c9DAB52447E9B841F86f44e4
// Management Contract Address 0x5e2a84801E43Fd13a4b6FE41Ae41D2E06F337456
// MANI Contract Address 0x5cBE8D88D481fA2d0317C3887bae44f8De5edB81


// localhost address
// account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// NFTMinting Contract Address 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
// Marketplace Contract address 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
// Management Contract Address 0x0165878A594ca255338adfa4d48449f69242Eb8F
// MANI Contract Address 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9


main()
  .then(() => process.exit(0))
  .catch((error) => console.log(error));
