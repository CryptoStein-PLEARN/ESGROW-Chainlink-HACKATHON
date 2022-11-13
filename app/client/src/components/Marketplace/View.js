import { useContext, useEffect, useState } from "react";
import SingleMarketCard from "./SingleMarketCard";
import QR from "../../images/qr.png";
import Rotate from "../../images/rotate.png";
import { ethers } from "ethers";
import { WalletContext } from "../../context/WalletContext";
import { useLocation } from "react-router-dom";

import MarketplaceAbi from "../../contracts/MintingAndBuying.sol/NFTMarketplace.json";
import { contractAddress } from "../../utils/contractAddress";

const ESGROW_TOKEN_TICKER = "FRACTIONS";

const View = () => {
  // const NFTMarketContractAddress = "0xbADDE1C2caa34F681515A2d221d1Bb7Af41C2E99";
  const location = useLocation();
  const data = location.state?.data;
  const index = location.state?.index;
  const [valuation, setValuation] = useState(0);
  const [soldPercentage, setSoldPercentage] = useState(10);
  const [payableAmount, setPayableAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [nftPrice, setNFTPrice] = useState(0);
  const [tickers, setTickers] = useState(["MATIC"]);
  const [rotated, setRotated] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [dynamicTicker, setDynamicTicker] = useState("FRACTIONS");
  const [lastDynamicTicker, setLastDynamicTicker] = useState("MATIC");
  const [defaultTicker, setDefaultTicker] = useState(ESGROW_TOKEN_TICKER);

  // const { awsDb, management, manitoken, account, provider, NFTMintingAddress, walletAddress, signer, NFTMintingAbi ,  nftminting} = useContext(WalletContext);

  const buyNFT = async (amountOfFraction, numberOfMaticPerFraction, nftId) => {
    try {
      if (!amount || amount < 1) {
        alert("amount must be greater than 1");
        return;
      }
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let tokenId = parseInt(nftId + 11);

        let number = parseInt(amount);
        let payable = parseInt(Math.ceil(payableAmount));

        console.log(payable);

        const MAX_PRIORITY_FEE_PER_GAS = ethers.utils.parseUnits("5", "gwei");
        const MAX_FEE_PER_GAS = ethers.utils.parseUnits("20", "gwei");
        const GAS_LIMIT = 2000000;

        const iface = new ethers.utils.Interface(MarketplaceAbi.abi);
        const data = iface.encodeFunctionData("buyFraction", [tokenId, number]);

        const tx = {
          from: account,
          to: contractAddress.NFTMarketContractAddress,
          value: ethers.utils.parseEther(payable.toString()),
          nonce: provider.getTransactionCount(account, "latest"),
          gasLimit: ethers.utils.hexlify(GAS_LIMIT), // 100000
          maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
          type: 2,
          chainId: 80001,
          maxFeePerGas: MAX_FEE_PER_GAS,
          data: data,
        };

        signer.sendTransaction(tx).then((transaction) => {
          console.log(transaction);
          console.log("Send finished!");
        });
      }
    } catch (error) {
      console.log("failed to send due to" + error);
    }
  };

  const setPageUp = () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const nftmintinge = new ethers.Contract(
        contractAddress.NFTMarketContractAddress,
        MarketplaceAbi.abi,
        signer
      );

      getNFTPrice(index, nftmintinge, 1);
      processPercentageSold(index, nftmintinge);
      getUserBalance(index + 11, nftmintinge);
    }
  };

  const tryToBuy = (e, amount, nftPrice, maticPrice) => {
    e.preventDefault();
    if (nftPrice) {
      buyNFT(amount, nftPrice, index);
    } else {
      alert("failed to load price");
    }
  };

  const processPercentageSold = async (nftId, nftmintinge) => {
    let remainingFractions = await getRemainingFractions(nftId, nftmintinge);

    let soldFractions = 1000 - remainingFractions / 10 ** 18;
    let percentageSold = soldFractions / 10;
    setSoldPercentage(percentageSold);
  };

  const getUserBalance = async (nftId, nftmintinge) => {
    if (window.ethereum) {
      let output = await nftmintinge.getMyBalance(nftId);
      setUserBalance(parseInt(output) / 10 ** 18);
    }
  };

  const getRemainingFractions = async (nftId, nftmintinge) => {
    const tokenId = nftId + 11;
    let result = await nftmintinge.getNFTBalance(tokenId);
    return parseInt(result);
  };

  const getNFTPrice = async (nftId, nftmintinge, maticPrice) => {
    try {
      let result = await nftmintinge.getNFTPrice(nftId);
      setNFTPrice(parseInt(result));
      let price = parseInt(result) / 10 ** 6;

      setValuation(price * maticPrice * 1000);
    } catch (e) {
      return e;
    }
  };

  useEffect(() => {
    setPageUp();
  }, [index]);

  const selectChange = (e) => {
    setDynamicTicker(e.target.value);
    setLastDynamicTicker(e.target.value);
  };

  const TickerSpan = ({ selectChange }) => (
    <span className="py-1 uppercase border text-xs rounded bg-[#AFD9D5]">
      <select
        disabled={rotated}
        className="b bg-transparent cursor-pointer w-16 border-none outline-none shadow-none"
        onChange={selectChange}
      >
        {tickers.map((ticker, key) => (
          <option
            {...{ key }}
            defaultValue={dynamicTicker}
            className="py-4 bg-white px-3 uppercase border-none shadow-none outline-none mb-3"
          >
            {dynamicTicker}
          </option>
        ))}
      </select>
    </span>
  );

  const Input = ({ onChange }) => (
    <input
      onChange={onChange}
      placeholder="0.0"
      type="number"
      className="w-3/4 border-none shadow-none outline-none text-black font-bold px-3 py-4 text-xl"
      defaultValue="0.0"
    />
  );

  const handleChange = (e) => {
    setAmount(e.target.value);
    if (nftPrice) {
      setPayableAmount(Math.ceil(calculatePrice(e.target.value, nftPrice)));
    }
  };

  const calculatePrice = (amount, perPrice) => {
    return (amount * perPrice) / 10 ** 6;
  };

  const onRotate = () => {
    if (!rotated) {
      setRotated((rotated) => !rotated);
      setDefaultTicker(lastDynamicTicker);
      setTickers((tickers) => [defaultTicker, ...tickers]);
    } else {
      setRotated((rotated) => !rotated);
      setDefaultTicker(ESGROW_TOKEN_TICKER);
      const newTickers = tickers.splice(1);
      setTickers([...newTickers]);
    }
  };

  return (
    <section>
      <div className="es-container pt-2 px-3 lg:px-20 pb-10 lg:mt-20 ">
        <div>
          <div className="bg-white  rounded p-10 mb-14 shadow-sm shadow-slate-300 ">
            <div className="mb-10">
              <span class="float-right bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900 text-lg">{`Your ${data.projectname} holdings: ${userBalance}`}</span>
            </div>
            <h2 className="uppercase font-bold text-2xl text-black mb-10 text-center">
              {data.projectname}
            </h2>

            <div className="flex flex-row mb-10 ">
              <div className="mr-5">
                <h2 className="text-lg text-black font-bold uppercase">
                  Description
                </h2>
              </div>
              <div className="text-sm text-black">{data.projecDescription}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <h2 className="capitalize font-bold flex items-center">
                  Percentage Sold
                  <img alt="question" className="ml-2 h-3 w-3" src={QR} />
                </h2>

                <div className="mt-5">
                  <h4 className="font-bold">{soldPercentage}%</h4>
                </div>
              </div>

              <div>
                <h2 className="capitalize font-bold flex items-center">
                  Implied Valuation
                  <img alt="question" className="ml-2 h-3 w-3" src={QR} />
                </h2>

                <div className="mt-5">
                  <h4 className="font-bold">{valuation} $</h4>
                </div>
              </div>

              <div>
                <h2 className="capitalize font-bold flex items-center">
                  Total Fractions
                  <img alt="question" className="ml-2 h-3 w-3" src={QR} />
                </h2>

                <div className="mt-5">
                  <h4 className="font-bold">1000</h4>
                </div>
              </div>

              <div>
                <h2 className="capitalize font-bold flex items-center">
                  Curator fee
                  <img alt="question" className="ml-2 h-3 w-3" src={QR} />
                </h2>

                <div className="mt-5">
                  <h4 className="font-bold">2%</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-rows-2 grid-flow-col gap-12 ">
            <div className="md:row-span-3">
              <SingleMarketCard index={index} nft={data} />
            </div>
            <div className="md:col-span-12 md:row-span-3 bg-white p-5 rounded-lg">
              <h2 className="uppercase font-bold flex items-center mb-10">
                Buy Fractions
                <img alt="question" className="ml-2 h-3 w-3" src={QR} />
              </h2>

              <div className="relative w-full">
                <div className="flex flex-col text-end">
                  <div className="w-full flex border border-1 rounded px-4">
                    <input
                      onChange={(e) => handleChange(e)}
                      placeholder="0.0"
                      type="number"
                      className="w-3/4 border-none shadow-none outline-none text-black font-bold px-3 py-4 text-xl"
                      defaultValue="0"
                    />
                    <div className="w-1/4 flex items-center justify-end">
                      <button className="py-1 px-3 uppercase border text-xs rounded mr-3 whitespace-nowrap">
                        Use Max
                      </button>

                      <TickerSpan {...{ selectChange }} />
                    </div>
                  </div>
                </div>

                <div className="relative my-16">
                  <hr className="border" />
                  <span className="bg-white font-bold whitespace-nowrap border p-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs uppercase">
                    {rotated
                      ? `1 FRACTION = ${nftPrice} MATIC`
                      : `1 FRACTION = ${nftPrice}  MATIC`}
                  </span>

                  <button className="bg-white font-bold border rounded-full p-2 absolute top-1/2 left-0 md:left-3 transform translate-x-0 -translate-y-1/2 text-xs uppercase">
                    <img src={Rotate} alt="rotate" className=" w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col text-end">
                  <div className="w-full flex border border-1 rounded pl-4">
                    <h6>{payableAmount}</h6>
                    <div className="w-full flex items-end justify-end">
                      <span className="py-1 px-3 uppercase border text-xs rounded mr-0 whitespace-nowrap bg-[#AFD9D5]">
                        {lastDynamicTicker}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className={`rounded-full by py-3 px-8 w-44 shadow-md mt-10 mx-auto shadow-slate-500  font-bold text-[#ffffff] hover:bg-green-600 z-10 uppercase bg-[#7EBA70]`}
                  onClick={(e) => {
                    tryToBuy(e, amount, nftPrice);
                  }}
                >
                  Fund
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default View;
