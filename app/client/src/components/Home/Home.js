import Title from "../Helpers/Titles";
import Button from "../Helpers/Button";
import FbIcon from "../../icons/fb.png";
import TwIcon from "../../icons/twitter.png";
import LkIcon from "../../icons/linked.png";
import DsIcon from "../../icons/discord.png";
import ESGrow from "../../images/esg.png";
import ESGAnime from "../../images/esg.gif";
import Crtlg from "../../images/logo.png";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { WalletContext } from "../../context/WalletContext";
import QrCode from "../../images/qrc.png";
import polygon_image from "../../images/polygon.png";

function Home() {
  const { management } = useContext(WalletContext)


  // TODO: start this somewhere
  const startAcceptingProposals = async () => {
    await management.startReceivingProposals(); //? from the form section
    console.log('started accepting proposals')
  }

  const startAcceptingVotes = async () => {
    await management.manuallyStartVoting()
    console.log('accepting votes')
  }

  const endVoting = async () => {
    await management.manuallyEndVoting()
    console.log('voting ended')
  }

  useEffect(() => {
    // startAcceptingProposals()
    // startAcceptingVotes()
    // endVoting()
  }, [management])

  return (
    <>
      <div className="es-container mt-20 px-3 lg:px-20 pb-10 lg:mt-20 relative">
        <div className="hero mt-10 lg:flex">
          <div className="lg:basis-2/5">
            <Title
              text={`ESGROW`}
              size={"text-6xl"}
              customStyles={`mb-10 text-[#ffffff]`}
              underline
            />

            {/* <h2 className="mt-10 lg:mt-0 text-2xl text-[#fffbee]">
              Let's save our mother earth and
              <span className="inline-block mx-1 text-black font-bold es-medium-font">
                ESGROW
              </span>
              together!
            </h2> */}

            <h3 className="text-md text-[#ffffff] font-bold mt-5">
              A Launchpad for users to submit their own ESG projects,
              participate in crowdfunding through voting, minting NFTs and
              Raising funds.
            </h3>

            <div className="flex items-center mt-10">
              <div className="r rounded-full h-1 p-1 bg-[#ffffff] mr-2"></div>

              <h3 className="text-base font-bold text-[#ffffff]">
                Currently accepting projects
              </h3>
            </div>

            <div className="mt-10 flex">
              <Link to="/submit">
                <Button active={true} text="Submit a project" />
              </Link>
              <Link to="/projects">
                <Button active={false} text="Vote a project" />
              </Link>
              <Link to="/marketplace">
              <Button disabled active={false} text="Funding" />
              </Link>
            </div>

            <div class="mt-5 w-80 bg-[#ffffff] rounded-full">
              <div
                className="bg-black text-xs text-[#ffffff] font-thin text-center p-0.5 leading-none rounded-l-full"
                style={{ width: "25%" }}
              >
                25%
              </div>
            </div>  
            <div class="mt-7 flex bg-white rounded-full items-center justify-center p-2 flex-wrap w-1/2">
            <img src={polygon_image} alt="polygon image" className="w-6 h-6 mr-3" />
            <p className="text-md text-purple-500">mumbai testnet</p>
            </div>
                       
          </div>
          
          <div className="lg:basis-3/5">
            {/* <img alt="" src={ESGrow} className="w-full h-full" /> */}
            <div className="es-grow-showcase lg:-mt-8 lg:pl-3 flex items-center justify-center h-full w-full">
              <div className="p-3 border-black rounded-full mt-5 lg:pl-6 lg:mt-0 es-grow">
                <img alt="Esgrow" src={ESGrow} className="w-full h-full" />
                
                {/* <img alt="Esgrow" src={ESGAnime} className="w-full h-full rounded-lg" /> */}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column"><img alt="Esgrow" src={Crtlg} className="w-15 h-8" /></div>
          <div class="column" id = "a"><img src={QrCode} alt="Esgrow Socials" className="w-20 h-20" /></div>  
      </div>
            
      </div>
    </>
  );
}

export default Home;
