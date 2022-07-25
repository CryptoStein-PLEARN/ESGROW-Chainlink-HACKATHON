import { useState } from "react";
import Title from "../Helpers/Titles";

function Projects() {
  const [prjts] = useState([1, 2, 3, 4, 5, 6]);
  return (
    <div className="es-container pt-2 px-3 lg:px-20 pb-10 lg:mt-20">
      <section className="pt-20 w-full">
        <Title
          text={`Projects`}
          size={"text-6xl"}
          customStyles={`text-lg`}
          underline
        />

        <div class="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3 mt-20">
          {prjts.map((_, key) => (
            <div {...{ key }} className="bg-white p-8 border-r-4">
              <div className="h-48 border w-full relative mb-5 cursor-pointer">
                <span className="text-xs text-black border p-2 absolute right-4 top-4">
                  1k Votes
                </span>
              </div>
              <div className="flex items-center justify-center">
                <button className="bg-[#7EBA70] rounded-full py-4 px-8 w-44 font-bold text-white z-10 cursor-pointer">
                  Vote
                </button>
              </div>

              <div className="mt-4">
                <h2 className="uppercase font-bold text-2xl text-black mb-4">
                  Save The Mammals
                </h2>

                <ul>
                  <li className="text-sm text-black font-bold mb-2">
                    Projects Name
                  </li>
                  <li className="text-sm text-black font-bold mb-2">
                    Category Name
                  </li>
                  <li className="text-sm text-black font-bold mb-2">
                    Brief Description
                  </li>
                  <li className="text-sm text-[#7eba70] font-bold mb-2">
                    <a href="/more" target="blank">www.readmore.com</a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Projects;
