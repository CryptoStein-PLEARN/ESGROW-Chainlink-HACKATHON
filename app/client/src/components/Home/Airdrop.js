import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../context/WalletContext";
import MANI from "../../images/mani.png";
import ManiTokenAbi from '../../contracts/MANIToken.sol/MANI.json';
import { ethers } from "ethers";
import contractAddress from "../../utils/contractAddress";

const Airdrop = () => {
  const ManiTokenAddress = "0x71f3513a72fB7e1DE3c8F3Fd55F8D92adCe0a1D4";
  const { manitoken } = useContext(WalletContext);
  const address = localStorage.getItem('address');
  const [lock, setLock] = useState(false);

  const onRegister = async () => {
    try {
      
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const mani = new ethers.Contract(
          contractAddress.ManiTokenAddress,
          ManiTokenAbi.abi,
          signer
        );

      await mani.register();
      alert('done');
        }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }






  return (
    <div className="es-container mt-20 px-3 lg:px-20 pb-10 lg:mt-20 relative">
      <div className="text-center">
        
        <h1 className="text-3xl text-[#ffffff] font-bold capitalize">
          Register for Airdrop
        </h1>
     
      </div>
    
      <div className="flex items-center flex-col justify-center mt-10">
        <input
          type="text"
          placeholder={address}
          defaultValue={address}
          className="w-full px-3 py-4 text-black outline-none shadow-none rounded"
          disabled
        />

        <>{!lock ?
          <button onClick={onRegister} className={`${!address ? `bg-black cursor-not-allowed` : `bg-[#ffffff]`} px-8 py-4 rounded ${!address ? `text-[#AFD9D5]` : `white`}  mt-10 font-bold`}
            disabled={!address ? true : false}
          >
            {!address ? `Connect Your Wallet` : "Register"}
          </button> :
          <h1 className="mt-4 text-red-500 font-bold">You have registered</h1>
        }
        </>
        
      </div>
      <br></br>
      <div className="text-center mt-3">
        <h1 className="text-3xl text-[#ffffff] font-bold capitalize">
          MANI Token Model
        </h1>
        <div className="flex items-center px-3 mt-3">
          <img alt="MANI" src={MANI} className="w-full h-full" />
        </div>
      </div>



    </div >
  );
};

export default Airdrop;
