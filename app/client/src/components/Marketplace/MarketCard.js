import { Link, useNavigate } from "react-router-dom";

const MarketCard = ({ e, index, nft }) => {
  const navigate = useNavigate();
  const handleClick = (e, index, nft) => {
    e.preventDefault();
    navigate("/fund", { state: { index: index, data: nft } });
  };

  console.log(nft.projectImage);

  // console.log(nft);

  return (
    <div className="bg-white p-8 border-r-4 rounded-md bg-white">
      <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900 float-right">
        {nft.projectCategory}
      </span>
      <div className="border w-full h-80 relative mb-5 cursor-pointer mt-10">
        {/* <span className="text-xs text-black border p-2 absolute right-4 top-4">
          1k Votes
        </span> */}
        <img
          src={nft.projectImage}
          className="max-h-80 object-fill"
          alt="nft"
        ></img>
      </div>

      <div className="mt-4">
        <ul>
          <li className="text-sm text-black font-bold mb-2">
            {nft.projectname}
          </li>
        </ul>
      </div>
      <div className="w-full flex justify-center mt-5">
        <button
          className={`rounded-full by py-3 px-8 w-44 shadow-md  shadow-slate-500  font-bold text-[#ffffff] hover:bg-green-600 z-10 uppercase bg-[#7EBA70]`}
          onClick={(e) => handleClick(e, index, nft)}
        >
          Fund
        </button>
      </div>
    </div>
  );
};

export default MarketCard;
