import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ethers } from "ethers";


// contract abis
import MamangementAbi from "./contracts/Management.sol/Management.json";
import NFTMintingAbi from './contracts/MintingAndBuying.sol/EsgrowNfts.json';
import MarketplaceAbi from './contracts/MintingAndBuying.sol/NFTMarketplace.json';
import ManiTokenAbi from './contracts/MANIToken.sol/MANI.json';

// web3 Context
import { WalletContext } from "./context/WalletContext";

// components
import Layout from "./components/Layout";
import Home from "./components/Home/Home";
import Submit from "./components/Projects/Submit";
import Projects from "./components/Projects/Projects";
import Marketplace from "./components/Marketplace/Marketplace";
import View from "./components/Marketplace/View";
import NotFound from "./components/Home/NotFound";
import Airdrop from "./components/Home/Airdrop";
import Rules from "./components/Projects/Rules"

import AWS, { DynamoDB } from 'aws-sdk';
import Settings from "./components/Home/Settings";

const config = {
  region: "us-east-1",
  apiVersion: 'latest',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
}

AWS.config.update(config);
const awsDb = new DynamoDB(config) // pass config to the constructor

const App = () => {
  // contracts
  const NFTMintingAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const MarketplaceAddress = "0xbADDE1C2caa34F681515A2d221d1Bb7Af41C2E99";
  const ManagementContractAddress = "0x9Ffe65ca50985eE803cA8C03D4848C979604f459"
  const ManiTokenAddress = "0x71f3513a72fB7e1DE3c8F3Fd55F8D92adCe0a1D4"

  // web3 states
  const [isConnectable, setIsConnectable] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setAddress] = useState("");
  const address = localStorage.getItem("address");

  // contract states
  const [management, setManagement] = useState(null);
  const [nftminting, setNftMinting] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [manitoken, setManiToken] = useState(null);
  const [maxProposals, setMaxProposals] = useState(50);
  const [proposalTimeFrame, setProposalTimeFrame] = useState(3);
  const [votingTimeFrame, setVotingTimeFrame] = useState(3);
  const [proposalMilliSeconds, setProposalMilliSeconds] = useState(0);
  const [votingMilliSeconds, setVotingMilliSeconds] = useState(0);

  const onConnect = async () => {
    const localProvider = new ethers.providers.Web3Provider(window.ethereum);

    const isMetaMaskConnected = await window.ethereum.request({
      method: "eth_accounts",
    });

    const localSigner = localProvider.getSigner();


    localProvider
      .send('eth_requestAccounts', [])
      .then((accounts) => setAccount(accounts[0]));

    if (isMetaMaskConnected.length < 1) {
      localStorage.removeItem("address");
    }

    if (isMetaMaskConnected.length < 1) {
      localProvider.send("eth_requestAccounts", []).then((accounts) => {
        setAddress(accounts[0]);
        localStorage.setItem("address", accounts[0]);
        setConnected(true);
        setProvider(localProvider);
        setSigner(localSigner);
      });
    } else {
      localStorage.setItem("address", account);
      setConnected(true);
      setProvider(localProvider);
      setSigner(localSigner);
      setAddress(address);
    }

    // contracts
    const ManagementContract = new ethers.Contract(
      ManagementContractAddress,
      MamangementAbi.abi,
      localSigner
    );
    window.management = ManagementContractAddress

    const NFTMintingContract = new ethers.Contract(
      NFTMintingAddress,
      NFTMintingAbi.abi,
      localSigner
    );
    window.nftminting = NFTMintingAddress

    const MarketplaceContract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceAbi.abi,
      localSigner
    );
    window.marketplace = MarketplaceAddress

    const ManiTokenContract = new ethers.Contract(
      ManiTokenAddress,
      ManiTokenAbi.abi,
      localSigner
    );
    window.manitoken = ManiTokenAddress

    setManagement(ManagementContract);
    setNftMinting(NFTMintingContract);
    setMarketplace(MarketplaceContract);
    setManiToken(ManiTokenContract);
  };


  useEffect(() => {
    onConnect();

    if (typeof window.ethereum != "object") {
    } else {
      setIsConnectable(true);
    }
  }, []);


  console.log(walletAddress);

  return (
    <Router>
      <WalletContext.Provider
        value={{
          connected,
          account,
          setAccount,
          provider,
          signer,
          isConnectable,
          walletAddress,
          onConnect,
          management,
          nftminting,
          marketplace,
          manitoken,
          awsDb,
          MamangementAbi,
          ethers,
          ManagementContractAddress,
          NFTMintingAddress,
          NFTMintingAbi,
          maxProposals,
          proposalTimeFrame,
          votingTimeFrame,
          setMaxProposals,
          setProposalTimeFrame,
          setVotingTimeFrame,
          proposalMilliSeconds,
          votingMilliSeconds,
          setProposalMilliSeconds,
          setVotingMilliSeconds,
        }}
      >
        <Layout>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/submit" element={<Submit />} />
            <Route exact path="/projects" element={<Projects />} />
            <Route exact path="/marketplace" element={<Marketplace />} />
            <Route exact path="/fund" element={<View />} />
            <Route exact path="/rules" element={<Rules />} />
            <Route exact path="/airdrop" element={<Airdrop />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </WalletContext.Provider>
    </Router>
  );
};

export default App;
