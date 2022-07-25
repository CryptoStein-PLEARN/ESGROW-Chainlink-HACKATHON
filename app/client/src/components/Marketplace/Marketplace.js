import { useState } from "react";
import { Link } from "react-router-dom";
import Title from "../Helpers/Titles";
import World from "../../images/world.png";

function Projects() {
  const [prjts] = useState([1, 2, 3, 4, 5, 6]);
  return (
    <div className="es-container pt-2 px-3 lg:px-20 pb-10 lg:mt-20">
      <section className="pt-20 w-full">
        <Title
          text={`Marketplace`}
          size={"text-6xl"}
          customStyles={`text-lg`}
          underline
        />

        <div class="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3 mt-20">
          {prjts.map((_, key) => (
            <div {...{ key }} className="bg-white p-8 border-r-4 relative">
              <Link to="/view">
                <div className="h-48 border w-full relative mb-5 cursor-pointer">
                  {/* image */}
                </div>
              </Link>

              <div className="mt-4">
                <h2 className="uppercase font-bold text-2xl text-black mb-4 .es-bold-font">
                  Save The Mammals
                </h2>

                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div>
                    <h3 className="font-bold text-sm">
                      Total <span className="block"></span> Supply
                    </h3>
                    <span className="block text-xs mt-3">100</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm">
                      Total <span className="block"></span> Supply
                    </h3>
                    <span className="block text-xs mt-3">100</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm">
                      Total <span className="block"></span> Supply
                    </h3>
                    <span className="block text-xs mt-3">100</span>
                  </div>
                </div>
              </div>
              <span
                className="bg-[#FFDD15] p-3 text-black absolute -top-1 -left-1 text-bold"
                title="price"
              >
                $100
              </span>

              <div className="w-full mt-4 flex items-center justify-end">
                <img src={World} alt="world" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Projects;
