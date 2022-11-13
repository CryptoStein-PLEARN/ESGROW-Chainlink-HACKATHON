import { Link, useNavigate } from "react-router-dom";

const SingleMarketCard = ({e,index, nft}) => {
 

    return (
        <div className="bg-white p-8 border-r-4 rounded-md bg-white ">
          <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900 float-right">{nft.category}</span>
          <div className="border w-full h-80 relative mb-5 cursor-pointer mt-10">
            {/* <span className="text-xs text-black border p-2 absolute right-4 top-4">
              1k Votes
            </span> */}
            <img src={nft.projectImage} className="max-h-80 object-fill"  alt="nft"></img>
          </div>
         
          <div className="mt-4">
          
            <ul>
             
              <li className="text-sm text-[#7eba70] font-bold mb-2">
               
              </li>
            </ul>
          </div>
          <div className="w-full flex justify-center mt-5">
         
          </div>
        
        </div>
      );
};

export default SingleMarketCard;
