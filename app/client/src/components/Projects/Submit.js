import React, { useState } from "react";
import Title from "../Helpers/Titles";
import CheckMark from "../../images/checkmark.png";

function Submit() {
  const [submitted] = useState(false);
  const [submitting] = useState(false);
  return (
    <>
      <div className="py-2"></div>
      <div className="es-container px-3 lg:px-20 pb-10 lg:mt-20 flex flex-col lg:flex-row">
        <div className="mb-10 lg:w-2/4">
          <Title
            text={`ESGROW`}
            size={"text-6xl"}
            customStyles={`text-lg`}
            underline
          />

          <h3 className="text-md text-black font-bold mt-10">
            A launchpad for users to submit their own ESG projects, participate
            in crowdfunding through voting, minting NFTs and Raising funds.
          </h3>

          <div className="mt-10">
            <Title
              text={`Submission Criteria`}
              size="text-2xl"
              customStyles={`text-lg md:text-2xl`}
            />
            <div className="text-black font-normal text-sm mt-1 ml-2">
              - Open to public
            </div>
          </div>

          <div className="mt-10">
            <Title
              text={`Submission Criteria`}
              size="text-2xl"
              customStyles={`text-lg md:text-2xl`}
            />
            <div className="text-black font-normal text-sm mt-1 ml-2">
              - Mani Token Holders
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          <div className="bg-[#FFFBEE] px-5 py-10 rounded">
            {!submitted ? (
              <form>
                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">Project Name</div>
                  <div className="w-full mt-2">
                    <input
                      type="text"
                      className="bg-[#FFECD7] outline-none border text-gray-900 text-sm block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Esg project name"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">Category</div>
                  <div className="w-full mt-2">
                    <select
                      name="cars"
                      className="w-full p-4 overflow-hidden bg-[#FFECD7] outline-none"
                    >
                      <option value="volvo" className="w-40 py-4 bg-white px-3">
                        Volvo
                      </option>
                      <option value="volvo" className="w-40 py-4 bg-white px-3">
                        Volvo
                      </option>
                      <option value="volvo" className="w-40 py-4 bg-white px-3">
                        Volvo
                      </option>
                      <option value="volvo" className="w-40 py-4 bg-white px-3">
                        Volvo
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">Brief Description</div>
                  <div className="w-full mt-2">
                    <input
                      type="text"
                      className="bg-[#FFECD7] outline-none border text-gray-900 text-sm block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Esg Project Description"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">
                    Link to Project and Main Documents
                  </div>
                  <div className="w-full mt-2">
                    <input
                      type="text"
                      className="bg-[#FFECD7] outline-none border text-gray-900 text-sm block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="www.website.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <button className="bg-[#5B9981] py-3 px-16 rounded text-white">
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-96 flex items-center justify-center flex-col">
                {!submitted ? (
                  <div className="flex items-center justify-center flex-col">
                    <img src={CheckMark} alt="Submitted" className="w-20" />
                    <div className="font-bold my-3">
                      Your Project has been Submitted
                    </div>
                  </div>
                ) : null}

                {submitting ? (
                  <svg
                    aria-hidden="true"
                    className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#7EBA70]"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Submit;
