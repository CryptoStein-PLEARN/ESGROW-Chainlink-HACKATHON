require("@nomiclabs/hardhat-waffle");

const ALCHEMY_API_KEY = "lD2jvcHq6pADXFC39QWgel24bImz8BzP"; // polygon key
const WALLET_PRIVATE_KEY = "684e4f0b4b1e2067b5e8d79b7ab57141e6a51352471c21b1b68b9ccac1994e03"; // wallet address
const ANOTHER_MUMBAI = "66ff187ff66d72e6454e835a94ddd54c419c1b3b86eb33a8a643e1203e68f935";

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "polygon_mumbai",
  networks: {
    polygon_mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ANOTHER_MUMBAI}`],
    },
      },
};

// npx hardhat run--network localhost scripts / deploy.js
// npx hardhat run scripts / deploy.js--network polygon_mumbai



