import { useContext, useEffect, useState } from "react";
import Title from "../Helpers/Titles";
import MarketCard from "./MarketCard";
import { prjts } from "../Projects/Projects"
import { WalletContext } from '../../context/WalletContext';
import { Shimmer } from "react-shimmer";
import { ethers } from "ethers";
import MarketplaceAbi from '../../contracts/MintingAndBuying.sol/NFTMarketplace.json';
import contractAddress from '../../utils/contractAddress';

function Projects() {
  // const NFTMarketContractAddress = "0xbADDE1C2caa34F681515A2d221d1Bb7Af41C2E99";
  
  const { awsDb, management, manitoken, account, provider, NFTMintingAddress, walletAddress, signer, NFTMintingAbi , hasMintedNFTs, nftminting} = useContext(WalletContext);
  const [nfts,setNfts] = useState(null);
  const [retrieved, setRetrieved] = useState(false);
  const [totalNftMinted, setTOtalNFTminted] = useState(3);
  const [nftsReady, setNftsReady] = useState(false);

  const getTotalNumberOfNftsMinted = async() => {
        try{
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const nftmintinge = new ethers.Contract(
             contractAddress.NFTMarketContractAddress,
               MarketplaceAbi.abi,
               signer
             );
        let result = await nftmintinge.getTotalNftsMinted();
        return result;
      }
        }catch(e){
          console.log(e);
        }
  }

  const getNftURL = async(nftId ) =>{
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftmintinge = new ethers.Contract(
         contractAddress.NFTMarketContractAddress,
           MarketplaceAbi.abi,
           signer
         );
    let result = await nftmintinge.getNFTUrl(nftId);
    return result;
  }
}
  catch(e){
    console.log(e);
    return e;
  }
}


const processNFTs = async () => {
  
 if(true){

  
  try {

   
    let idResult = await getTotalNumberOfNftsMinted();
    let id = parseInt(idResult);
   
    if(id === 0 || isNaN(id)){
      console.log("no nfts yet");
      return;
      setRetrieved(false);
    }

    console.log(id);
    setNftsReady(true);
    let tokenIds = [];
    // let finalTokenId = [];
    // let availableShares = [];
    let nftsA = [];
    let nftsB = [];

    for (let i = 0; i < id; i++) {
        tokenIds.push(i);
    }


    const tokenUrls = await Promise.all(

      tokenIds.map((item) => {
        return getNftURL(item);
      })
    );

  console.log(tokenUrls);
    const datas = await Promise.all(
      tokenUrls.map((item) => {
        if (item !== "") {
          const response = fetch(`https://ipfs.io/ipfs/${item}`)
            .then((res) => res.text())
            .then((data) => data.toString());
        console.log(response);  
          return response;
        } else {
          return "";
        }
      })
    );
  
    console.log(datas)

    datas.filter((item) => {
      if (item !== "") {
        const itema = JSON.parse(item);
        nftsA.push(itema);
        return itema;
      } else {
      }
    });

    console.log(nftsA)
    nftsA.map((item) => {
      if (item.hasOwnProperty("attributes") === false) {
        nftsB.push(item);
      } else {
        if (item.attributes[0].private === false) {
         nftsB.push(item);
        }
      }
    });

    // for (let i = 0; i <= identitiesb.length; i++) {
    //   identitiesb[i]["availableShare"] = numberShares[i];
    // }
    // console.log(numberShares);
    console.log(totalNftMinted);
   
    console.log(datas);
    setNfts(nftsB);
    setRetrieved(true);
   console.log(nftsB);
  } catch (error) {
   alert(error);
  }
}
else{
  setNfts(prjts);
  setRetrieved(true);
  
}
};
useEffect(() => {
  processNFTs();
}, []);


  return (
    <>
   { retrieved?
    ( 
      <>
     {!retrieved && 
     <>
 <CollectionsLoader/>
     </>
     }

     {nfts !== null && nfts.length !== 0 ? (
         <div className="es-container pt-2 px-3 lg:px-20 pb-10 lg:mt-20">
         <section className="pt-20 w-full">
           <Title
             text={`Marketplace`}
             size={"text-4xl"}
             customStyles={``}
             underline
           />
   
           <div class="grid gap-12 mb-6 md:grid-cols-2 lg:grid-cols-3 mt-20">
             {nfts.map((nft, key) => {
              return (
               <div {...{ key }}>
                 <MarketCard index = {key} nft={nft} />
               </div>
             )
              })
}
           </div>
         </section>
       </div>
      ) : (
        null
      )}
  
    </>)
    : <CollectionsLoader></CollectionsLoader>}
    </>
  );
}

const CollectionsLoader = () => {
  return (
    <div className="es-container pt-2 px-3 lg:px-20 pb-10 lg:mt-20">
         <section className="pt-20 w-full">
           <Title
             text={`Marketplace`}
             size={"text-4xl"}
             customStyles={``}
             underline
           />
    <div>
      <section class="text-gray-600 body-font">
        <div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
          <div class="text-center lg:w-2/3 w-full">
            <p class="mb-8 text-xl leading-relaxed">It is empty in here 😪 , no projects available for funding</p>
          </div>
        </div>
      </section>
    </div>
    </section>
       </div>
  );
};

export default Projects;
