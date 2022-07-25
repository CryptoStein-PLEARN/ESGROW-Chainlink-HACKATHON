import Title from "../Helpers/Titles";
import Button from "../Helpers/Button";
import FbIcon from "../../icons/fb.png";
import TwIcon from "../../icons/twitter.png";
import LkIcon from "../../icons/linked.png";
import DsIcon from "../../icons/discord.png";
import ESGrow from "../../images/esg.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="es-container px-3 lg:px-20 pb-10 lg:mt-20">
        <div className="hero mt-10 lg:flex">
          <div className="lg:basis-2/5">
            <Title
              text={`ESGROW`}
              size={"text-6xl"}
              customStyles={`text-lg mb-10`}
              underline
            />

            <h2 className="mt-10 lg:mt-0 text-2xl text-white">
              Let's save our mother earth and
              <span className="inline-block mx-1 text-black font-bold es-medium-font">
                ESGROW
              </span>
              together!
            </h2>

            <h3 className="text-md text-black font-bold mt-10">
              A launchpad for users to submit their own ESG projects,
              participate in crowdfunding through voting, minting NFTs and
              Raising funds.
            </h3>

            <div className="flex items-center mt-10">
              <div className="r rounded-full h-1 p-1 bg-black mr-2"></div>

              <h3 className="text-base font-bold">
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
                <Button disabled active={false} text="Funding" />
            </div>

            <div class="mt-5 w-80 bg-white rounded-full">
              <div
                className="bg-black text-xs text-white font-thin text-center p-0.5 leading-none rounded-l-full"
                style={{ width: "25%" }}
              >
                25%
              </div>
            </div>

            <div className="flex items-center mt-20">
              <a href="asdfas" className="mr-5">
                <div className="w-6 h-6 flex items-center">
                  <img alt="esgrow on facebook" src={FbIcon} />
                </div>
              </a>

              <a href="asdfas" className="mr-5">
                <div className="w-6 h-6 flex items-center">
                  <img alt="esgrow on twitter" src={TwIcon} />
                </div>
              </a>

              <a href="asdfas" className="mr-5">
                <div className="w-6 h-6 flex items-center">
                  <img alt="esgrow on linkedIn" src={LkIcon} />
                </div>
              </a>

              <a href="asdfas" className="mr-5">
                <div className="w-6 h-6 flex items-center">
                  <img alt="esgrow on discord" src={DsIcon} />
                </div>
              </a>
            </div>
          </div>
          <div className="lg:basis-3/5">
            <div className="es-grow-showcase lg:-mt-8 lg:pl-3 flex items-center justify-center h-full w-full">
              <div className="p-3 border-black rounded-full mt-10 lg:pl-6 lg:mt-0 es-grow">
                <img alt="Esgrow" src={ESGrow} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
