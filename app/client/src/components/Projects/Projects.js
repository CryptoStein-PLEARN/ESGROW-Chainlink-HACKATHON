import { useContext, useEffect, useState } from "react";
import { NFTStorage, Blob } from "nft.storage";
import Title from "../Helpers/Titles";
import { ethers } from "ethers";
import { WalletContext } from "../../context/WalletContext";
import { catImgs } from "../../images/utils";
import MamangementAbi from "../../contracts/Management.sol/Management.json";
import ManiTokenAbi from "../../contracts/MANIToken.sol/MANI.json";
import MarketplaceAbi from "../../contracts/MintingAndBuying.sol/NFTMarketplace.json";
import contractAddress from "../../utils/contractAddress";

export const prjts = [
  {
    name: "One Earth Future",
    category: "Social",
    description:
      "One Earth Future (OEF) prioritizes diversity, inclusion and belonging, not only throughout our offices and staff teams, but also within the programs we operate globally.",
    link: "https://oneearthfuture.org/",
    img: "https://esgrowesg.s3.eu-west-2.amazonaws.com/E-+Carbon+emission.jpeg",
    votes: "2k",
    founders: "thanh and nada",
    ramount: 1000,
  },
  {
    name: "Happy People",
    category: "Social",
    description:
      "One Earth Future (OEF) prioritizes diversity, inclusion and belonging, not only throughout our offices and staff teams, but also within the programs we operate globally.",
    link: "https://oneearthfuture.org/",
    img: "https://esgrowesg.s3.eu-west-2.amazonaws.com/S-Women+Inclusion.jpeg",
    votes: "2k",
    founders: "thanh and nada",
    ramount: 1000,
  },
];

function Projects() {
  const ACTIVE_COLOR = "bg-[#F5F5DC]";
  const ACTIVE_HOVER_COLOR = "bg-amber-100";
  const DE_ACTIVATED_COLOR = "bg-white";
  const [stateObject, setStateObject] = useState({
    A: true,
    B: false,
    C: false,
    D: false,
  });
  const [watcher, setWatcher] = useState(1);
  const [colorsObject, setColorsObject] = useState(null);
  const [votingComplete, setVotingComplete] = useState(false);
  const {
    awsDb,
    management,
    manitoken,
    account,
    walletAddress,
    votingIsReady,
    nftminting,
  } = useContext(WalletContext);
  const [allVotes, setAllVotes] = useState([]);
  const [proposals, setProposals] = useState([]);
  const iVoted = localStorage.getItem("iVoted");
  const [startedReceivingVotes, setStartReceivingVotes] = useState(false);
  const [endedVoting, setEndedVoting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [canTriggerAirdrop, setCanTriggerAirdrop] = useState(true);
  const [canStartVoting, setCanStartVoting] = useState(false);
  const [canEndVoting, setCanEndVoting] = useState(false);
  const [canProcessResult, setCanProcessResult] = useState(false);
  const [colorA, setColorA] = useState(ACTIVE_COLOR);
  const [colorAHover, setColorAHover] = useState(ACTIVE_HOVER_COLOR);
  const [colorB, setColorB] = useState(DE_ACTIVATED_COLOR);
  const [colorBHover, setColorBHover] = useState(DE_ACTIVATED_COLOR);
  const [colorC, setColorC] = useState(DE_ACTIVATED_COLOR);
  const [colorCHover, setColorCHover] = useState(DE_ACTIVATED_COLOR);
  const [colorD, setColorD] = useState(DE_ACTIVATED_COLOR);
  const [colorDHover, setColorDHover] = useState(DE_ACTIVATED_COLOR);

  const [retrieved, setRetrieved] = useState(null);

  const Votes = localStorage.getItem("myVotes");
  const apiKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQwOTM1MmIyMDgzMzAyNjRBNmJlMjg3NzA2RjdiNzVGZkE3MTdlN2IiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTAzMTYyNDE3NCwibmFtZSI6IlBsZWFybiJ9.rOhiUDXANQt_KLmFeT4R5xY-_fBp4DuJ8HKgWCqCkFQ";
  // const ManagementContractAddress = "0x9Ffe65ca50985eE803cA8C03D4848C979604f459";
  // const ManiTokenAddress = "0x71f3513a72fB7e1DE3c8F3Fd55F8D92adCe0a1D4";
  // const NFTMarketContractAddress = "0xbADDE1C2caa34F681515A2d221d1Bb7Af41C2E99";

  const client = new NFTStorage({ token: apiKey });

  // TODO: use timer to manage this

  const processColorsObject = async () => {
    try {
      if (window.ethereum) {
        let ipfsStringObject;
        let ipfsObject;

        const stateUrl = await getStateUrl();

        if (stateUrl !== "") {
          const response = await fetch(`https://ipfs.io/ipfs/${stateUrl}`)
            .then((res) => res.text())
            .then((data) => data.toString());

          ipfsStringObject = response;
          console.log(ipfsStringObject);

          if (ipfsStringObject !== "") {
            ipfsObject = JSON.parse(ipfsStringObject);
          } else {
          }

          if (isEmpty(ipfsObject)) {
          } else {
            console.log(ipfsObject);
            setStateObject(ipfsObject);
            prepareVotingColors(ipfsObject);
          }
        }
      } else {
        console.log("empty");
      }
    } catch (error) {
      console.log(error);
     
    }
  };

  function isEmpty(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  const getStateUrl = async () => {
    try {
      console.log(contractAddress.ManagementContractAddress);
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );

        let latestId = await managemente.getStateUrl();
        let StringifiedUrl = latestId.toString();
        console.log(StringifiedUrl);
        return StringifiedUrl;
      }
    } catch (error) {
      console.log(error);
  
    }
  };

  const generateStateUrl = async (urlObject) => {
    try {
      const metadata = new Blob([JSON.stringify(urlObject)], {
        type: "application/json",
      });

      const cid = await client.storeBlob(metadata);
      console.log(cid);
      let url = cid.toString();
      return url;
    } catch (e) {
      console.log(e);
    }
  };

  const setStateUrl = async (newUrl) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );

        await managemente.setStateUrl(newUrl);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const prepareVotingColors = async (colorObject) => {
    if (colorObject.A) {
      setColorA(ACTIVE_COLOR);
      setColorAHover(ACTIVE_HOVER_COLOR);
      setCanTriggerAirdrop(true);
    } else {
      setColorA(DE_ACTIVATED_COLOR);
      setColorAHover(DE_ACTIVATED_COLOR);
      setCanTriggerAirdrop(false);
    }

    if (colorObject.B) {
      setColorB(ACTIVE_COLOR);
      setColorBHover(ACTIVE_HOVER_COLOR);
      setCanStartVoting(true);
    } else {
      setColorB(DE_ACTIVATED_COLOR);
      setColorBHover(DE_ACTIVATED_COLOR);
      setCanStartVoting(false);
    }

    if (colorObject.C) {
      setColorC(ACTIVE_COLOR);
      setColorCHover(ACTIVE_HOVER_COLOR);
      setCanEndVoting(true);
    } else {
      setColorC(DE_ACTIVATED_COLOR);
      setColorCHover(DE_ACTIVATED_COLOR);
      setCanEndVoting(false);
    }
    if (colorObject.D) {
      setColorD(ACTIVE_COLOR);
      setColorDHover(ACTIVE_HOVER_COLOR);
      setCanProcessResult(true);
    } else {
      setColorD(DE_ACTIVATED_COLOR);
      setColorDHover(DE_ACTIVATED_COLOR);
      setCanProcessResult(false);
    }
  };

  const startVoting = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );
        if (!startedReceivingVotes) {
          await managemente.manuallyStartVoting();
          setStartReceivingVotes(true);
          let urlObject = { A: false, B: false, C: true, D: false };
          let urlString = await generateStateUrl(urlObject);
          await managemente.setStateUrl(urlString);
          prepareVotingColors({ A: false, B: false, C: true, D: false });
          alert("done");
        }
      } else {
        alert("already triggered start voting");
      }
    } catch (e) {
      alert(e);
    }
    // await manitoken.manuallyStartAirDrop() //? after receiving is done
    // await management.manuallyEndVoting(); //? after voting time is elapsed call this
  };

  const endVoting = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );
        if (!endedVoting) {
          await managemente.manuallyEndVoting();
          setEndedVoting(true);
          let urlObject = { A: false, B: false, C: false, D: true };
          let urlString = await generateStateUrl(urlObject);
          await managemente.setStateUrl(urlString);
          prepareVotingColors({ A: false, B: false, C: false, D: true });
          alert("done");
        } else {
          console.log("already triggered end voting");
        }
      }
    } catch (e) {
      alert(e);
    }
  };

  const startProcessingResults = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );

        const nftmintinge = new ethers.Contract(
          contractAddress.NFTMarketContractAddress,
          MarketplaceAbi.abi,
          signer
        );

        let locked = await nftmintinge.checkIfIsLocked();

        if (locked) {
          alert("result is ready");
          return;
        }

        let result = await managemente.getResult();

        let outputA = converResultToArray(result);
        let outputB = converResultToArray(result);
        let prewinners = sortResults(outputA, outputB, outputA.length);
        let winners = trimOutputArray(prewinners);

        let winnersPrices = getPrices(projects, winners);
        let winningProposals = getWinnersArrays(projects, winners);

        console.log(winners);
        console.log(winnersPrices);
        console.log(winningProposals);

        getNFTsReady(winnersPrices, winningProposals, 1, nftmintinge);
        let urlObject = { A: false, B: false, C: false, D: false };
        let urlString = await generateStateUrl(urlObject);
        await managemente.setStateUrl(urlString);
        prepareVotingColors({ A: false, B: false, C: false, D: false });
        alert("done");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const getPrices = (projectsArray, winnersArray) => {
    let prices = [];
    for (let i = 0; i < winnersArray.length; i++) {
      let id = winnersArray[i];

      prices.push(parseInt(projectsArray[id].amount, 10));
    }
    return prices;
  };

  const getWinnersArrays = (projectsArray, winnersArray) => {
    let winners = [];
    for (let i = 0; i < winnersArray.length; i++) {
      let id = winnersArray[i];
      let projectname = projectsArray[id].projectname;
      let projecDescription = projectsArray[id].description;
      let projectImage = catImgs[projectsArray[id].category];
      let projectCategory = projectsArray[id].category;

      let newObject = {
        projectname,
        projecDescription,
        projectImage,
        projectCategory,
      };
      winners.push(newObject);
    }

    return winners;
  };

  const trimOutPositionZero = (array) => {
    let output = [];
    for (let i = 1; i < array.length; i++) {
      output.push(array[i]);
    }
    return output;
  };

  const trimOutputArray = (array) => {
    if (array.length <= 10) {
      return array;
    } else {
      let newOutput = [];
      for (let i = 0; i < 10; i++) {
        newOutput.push(array[i]);
      }
      return newOutput;
    }
  };

  const converResultToArray = (resultArray) => {
    let output = [];
    for (let i = 0; i < resultArray.length; i++) {
      output.push(parseInt(resultArray[i], 10));
    }
    console.log(output);
    let newArray = trimOutPositionZero(output);
    console.log(newArray);
    return newArray;
  };

  const startAirDrop = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const mani = new ethers.Contract(
          contractAddress.ManiTokenAddress,
          ManiTokenAbi.abi,
          signer
        );

        await mani.manuallyStartAirDrop();

        let urlObject = { A: false, B: true, C: false, D: false };
        let urlString = await generateStateUrl(urlObject);

        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );

        await managemente.setStateUrl(urlString);
        prepareVotingColors({ A: false, B: true, C: false, D: false });
        alert("done");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const getVotingResult = async () => {
    // let process = await management.getResult();
    // const results = process.wait();
    // console.log(results)
  };

  const getNFTsReady = async (
    priceArray,
    nftObjectArray,
    maticPrice,
    nftmintinge
  ) => {
    let prices = processPriceArray(priceArray, maticPrice);
    let nftsUrls = await processUrlArray(nftObjectArray);
    console.log(nftsUrls);
    await setNFTSUP(prices, nftsUrls, nftmintinge);
  };

  const voteProposal = async (key) => {
    let id = key + 1;
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        let notEligible = await managemente.reJectVote(account);
        if (notEligible) {
          alert("you have used up your votes");
          return;
        }
        await managemente.voteProposal(id);
        console.log("voted");
        alert("voted");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const sortResults = (resultArrayA, resultArrayB, winningSize) => {
    const arrayA = resultArrayA;
    let arrayB = resultArrayB;
    arrayB.sort(function (a, b) {
      return a - b;
    });
    arrayB.reverse();
    let result = [];
    for (let i = 0; i < winningSize; i++) {
      result.push(arrayA.indexOf(arrayB[i]));
    }
    return result;
  };

  const makeNftPriceArrays = (objectArray) => {
    let prices = [];
    for (let i = 0; i < objectArray; i++) {
      prices.push(objectArray[i].amount);
    }
    return prices;
  };

  const makeNftJsonArray = (objectArray) => {
    let array = [];
    for (let i = 0; i < objectArray; i++) {
      let projectName = objectArray[i].name;
      let projecDescription = objectArray[i].description;
      let img = catImgs.objectArray[i].category;
      let object = { projectName, projecDescription, img };
      array.push(object);
    }
  };

  const processUrlArray = async (objectArray) => {
    console.log(objectArray);
    let output = [];
    for (let i = 0; i < objectArray.length; i++) {
      let result = await processUrls(objectArray[i]);
      output.push(result);
    }
    return output;
  };

  const processPriceArray = (priceArray, maticPrice) => {
    let output = [];

    for (let i = 0; i < priceArray.length; i++) {
      let result = processPrice(priceArray[i], maticPrice);
      output.push(result);
    }
    return output;
  };

  const processPrice = (projectPrice, maticPrice) => {
    let dollarPricePerFraction = projectPrice / 1000;
    let numberOfMaticPerFraction = dollarPricePerFraction / maticPrice;
    let priceToPowerSix = numberOfMaticPerFraction * 10 ** 6;
    return priceToPowerSix;
  };

  const processUrls = async (nftObject) => {
    //kind of redundant if there is an object array

    try {
      const metadata = new Blob([JSON.stringify(nftObject)], {
        type: "application/json",
      });

      const cid = await client.storeBlob(metadata);
      console.log(cid);
      let url = cid.toString();
      return url;
    } catch (e) {
      console.log(e);
    }
  };

  const setNFTSUP = async (priceArray, urlArray, nftmintinge) => {
    console.log(priceArray);
    console.log(urlArray);
    await nftmintinge.setNFTSUp(priceArray, urlArray);
  };

  const getLatestTokenId = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );

        let latestId = await managemente.getlastProposal();
        let StringifiedId = latestId.toString();
        console.log(StringifiedId);
        return StringifiedId;
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  const getProjectUrl = async (proposalId) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );
        let url = await managemente.getTheProposalUrl(proposalId);
        return url;
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const processProjects = async () => {
    try {
      if (window.ethereum) {
        let idString = await getLatestTokenId();
        let id = parseInt(idString, 10);

        let projectIds = [];
        // let finalTokenId = [];
        // let availableShares = [];
        let projectsA = [];
        let projectsB = [];

        for (let i = 1; i <= id; i++) {
          projectIds.push(i);
        }

        // const availableSharese = await Promise.all(
        //   tokenIds.map((item) => {
        //     return getAvailableShares(item);
        //   })
        // );

        // const numberShares = availableSharese.map((item) =>
        //   ethers.utils.formatUnits(item, 0)
        // );

        const tokenUrls = await Promise.all(
          projectIds.map((item) => {
            return getProjectUrl(item);
          })
        );

        const datas = await Promise.all(
          tokenUrls.map((item) => {
            if (item !== "") {
              const response = fetch(`https://ipfs.io/ipfs/${item}`)
                .then((res) => res.text())
                .then((data) => data.toString());

              return response;
            } else {
              return "";
            }
          })
        );

        datas.filter((item) => {
          if (item !== "") {
            const itema = JSON.parse(item);
            projectsA.push(JSON.parse(item));
            return itema;
          } else {
          }
        });

        projectsA.map((item) => {
          if (item.hasOwnProperty("attributes") === false) {
            projectsB.push(item);
          } else {
            if (item.attributes[0].private === false) {
              projectsB.push(item);
            }
          }
        });

        // for (let i = 0; i <= identitiesb.length; i++) {
        //   identitiesb[i]["availableShare"] = numberShares[i];
        // }
        setProjects(projectsB);
        setRetrieved(true);

        console.log(projectsB);
      }
    } catch (error) {
      console.log(error);
     
    }
  };

  const processWinnersUrl = async (tokenids) => {
    try {
      let projectIds = [];
      // let finalTokenId = [];
      // let availableShares = [];
      let projectsA = [];
      let projectsB = [];

      // const availableSharese = await Promise.all(
      //   tokenIds.map((item) => {
      //     return getAvailableShares(item);
      //   })
      // );

      // const numberShares = availableSharese.map((item) =>
      //   ethers.utils.formatUnits(item, 0)
      // );

      const tokenUrls = await Promise.all(
        tokenids.map((item) => {
          return getProjectUrl(item);
        })
      );

      const datas = await Promise.all(
        tokenUrls.map((item) => {
          if (item !== "") {
            const response = fetch(`https://ipfs.io/ipfs/${item}`)
              .then((res) => res.text())
              .then((data) => data.toString());

            return response;
          } else {
            return "";
          }
        })
      );

      datas.filter((item) => {
        if (item !== "") {
          const itema = JSON.parse(item);
          projectsA.push(JSON.parse(item));
          return itema;
        } else {
        }
      });

      projectsA.map((item) => {
        if (item.hasOwnProperty("attributes") === false) {
          projectsB.push(item);
        } else {
          if (item.attributes[0].private === false) {
            projectsB.push(item);
          }
        }
      });

      // for (let i = 0; i <= identitiesb.length; i++) {
      //   identitiesb[i]["availableShare"] = numberShares[i];
      // }
      setProjects(projectsB);
      setRetrieved(true);
      console.log(projectsB);
    } catch (error) {
      console.log(error);
   
    }
  };

  useEffect(() => {
    processProjects();
    processColorsObject();
  }, [management]);

  // useEffect(() => {
  //   startVoting()
  //   getVotingResult()
  //   localStorage.setItem("myVotes", 0);
  // }, [management, manitoken])

  // const voteProposal = async (id, projectname, category) => {
  //   if (Votes >= 2) {
  //     // localStorage.setItem("iVoted", true);
  //     return;
  //   }

  //   const proposalID = parseInt(id.S);

  //   try {
  //     let output = await management.voteProposal(proposalID);
  //     output.wait();

  //     awsDb.putItem({
  //       TableName: 'votes',
  //       Item: {
  //         id: {
  //           S: (Math.floor(Math.random() * 101000100) + 10).toString()
  //         },
  //         proposalId: {
  //           S: `${proposalID}`
  //         },
  //         sender: {
  //           S: account
  //         },
  //         projectname: {
  //           S: projectname.S.toString()
  //         },
  //         category: {
  //           S: category.S.toString(),
  //         },
  //       }
  //     }, function (err, data) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log('great success: %j', data);
  //       }
  //     });

  //     const myVotes = parseInt(localStorage.getItem("myVotes")) + 1;
  //     const newVoteCount = Number(myVotes)
  //     localStorage.setItem('myVotes', newVoteCount);
  //   }
  //   catch (e) {
  //     console.log(e.reason);
  //     localStorage.setItem("iVoted", true);
  //   }
  // }

  // useEffect(() => {
  //   awsDb.scan({ TableName: "proposals" }, function (err, { Items }) {
  //     setProposals(Items)
  //   })

  //   // get proposals
  //   awsDb.scan({ TableName: "votes" }, function (err, { Items }) {
  //     setAllVotes(Items)
  //   })
  // }, []);

  return (
    <div className="es-container pt-2 px-3 lg:px-20 pb-10 lg:mt-20">
      <section className="pt-20 w-full">
        <Title
          text={`Projects`}
          size={"text-6xl"}
          customStyles={``}
          underline
        />
        <div className="mt-20">
          <button
            type="button"
            disabled={!canTriggerAirdrop}
            className={`text-gray-800 ${colorA} hover:${colorAHover} focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-6 mb-2 `}
            onClick={() => startAirDrop()}
          >
            Trigger Airdrop ⛱️
          </button>

          <button
            type="button"
            disabled={!canStartVoting}
            className={`text-gray-800 ${colorB} hover:${colorBHover} focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-6 mb-2 `}
            onClick={(e) => startVoting()}
          >
            Start Voting
          </button>
          <button
            type="button"
            disabled={!canEndVoting}
            className={`text-gray-800 ${colorC} hover:${colorCHover} focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-6 mb-2 `}
            onClick={(e) => endVoting()}
          >
            End Voting
          </button>
          <button
            type="button"
            disabled={!canProcessResult}
            className={`text-gray-800 ${colorD} hover:${colorDHover} focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-6 mb-2 `}
            onClick={(e) => startProcessingResults()}
          >
            Process Results
          </button>
        </div>
        <div class="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3 mt-20">
          {projects.length > 0 ? (
            <>
              {projects.map((project, key) => {
                return (
                  <div {...{ key }} className="bg-white p-8 border-r-4">
                    <div className="relative mb-5 cursor-pointer flex items-center justify-center">
                      {votingComplete ? (
                        <span className="text-xs text-black border p-2 absolute right-4 top-4 bg-white">
                          {project.votes} Votes
                        </span>
                      ) : null}

                      <div className="h-48 w-64">
                        <img
                          src={catImgs[project.category]}
                          title={"title"}
                          alt={"alt"}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        className={`rounded-full py-4 px-8 w-44 font-bold text-[#ffffff] z-10 uppercase
                      ${
                        iVoted
                          ? `cursor-not-allowed bg-red-400`
                          : `bg-[#7EBA70] cursor-pointer`
                      }
                    `}
                        onClick={() => voteProposal(key)}
                        disabled={iVoted}
                      >
                        Vote
                      </button>
                    </div>

                    <div className="mt-4">
                      <h2 className="uppercase font-bold text-2xl text-black mb-4 text-center">
                        {project.projectName}
                      </h2>

                      <ul>
                        <li className="text-sm text-black font-bold mb-2">
                          {project.projectname}
                        </li>
                        <li className="text-sm text-black font-bold mb-2">
                          {project.category}
                        </li>
                        <li className="text-sm text-black font-bold mb-2">
                          {project.description}
                        </li>
                        <li className="text-sm text-[#7eba70] font-bold mb-2">
                          <a href={`http://${project.link}`} target="blank">
                            {project.link}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex items-center">
              {" "}
              <h1 className="font-bold">No Proposals for now</h1>{" "}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Projects;
