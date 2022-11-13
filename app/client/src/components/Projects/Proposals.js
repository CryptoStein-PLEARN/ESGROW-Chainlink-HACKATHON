const MarketCard = (nft) => {


    const handleClickedBuy = (proposalId) => {
  
    }
  
  
    
  
    return (
      <div className="bg-white p-8 border-r-4 rounded-md bg-amber-50">
        <div className="h-48 border w-full relative mb-5 cursor-pointer">
          {/* <span className="text-xs text-black border p-2 absolute right-4 top-4">
            1k Votes
          </span> */}
          <img src={nft.img} className="w-ful h-full" alt="nft"></img>
        </div>
  
        <div className="mt-4">
          <h2 className="uppercase font-bold text-2xl text-black mb-4">
            {nft.name}
          </h2>
  
          <ul>
            <li className="text-sm text-black font-bold mb-2">{nft.category}</li>
            <li className="text-sm text-black font-bold mb-2">
             {nft.description}
            </li>
            <li className="text-sm text-[#7eba70] font-bold mb-2">
              <a href="/more" target="blank">
              {nft.link}
              </a>
            </li>
          </ul>
         
                     
        </div>
        <div className="w-full flex justify-center mt-5">
        <button className={`rounded-full by py-4 px-8 w-44 shadow-md  shadow-slate-500  font-bold text-[#ffffff] hover:bg-green-600 z-10 uppercase bg-[#7EBA70]`}>
                        Buy
                      </button>
        </div>
      
      </div>
    );
  };
  
  export default MarketCard;
  