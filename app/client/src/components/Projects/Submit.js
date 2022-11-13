import React, { useContext, useEffect, useState } from "react";
import Title from "../Helpers/Titles";
import CheckMark from "../../images/checkmark.png";
import { Link } from "react-router-dom";
import RuleIcon from "../Helpers/RuleIcon";
import { NFTStorage, Blob } from "nft.storage";
import { WalletContext } from "../../context/WalletContext";
import { randomNumber } from "../../utils/helper";
import { ethers } from "ethers";
import MamangementAbi from "../../contracts/Management.sol/Management.json";
import contractAddress from "../../utils/contractAddress";

function Submit() {
  const [receivingProposals, setReceivingProposals] = useState(false);
  const [notEligible, setNotEligible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [votes, setVotes] = useState(0);
  const [newProposalId, setNewProposalId] = useState();
  const [newProposalSender, setNewProposalSender] = useState();
  const [projectname, setProjectName] = useState(
    `Proposal Name ${Math.floor(Math.random() * 10003298419283) + 10}`
  );
  const [category, setCategory] = useState("S-WOMEN-INCLUSION");
  const [description, setDescription] = useState("Buidling with Women In Tech");
  const [link, setLink] = useState("sam.thelle.io");
  const [founder, setFounder] = useState("Thanh");
  const [amount, setAmount] = useState(0);
  // const { management, awsDb, account, walletAddress} = useContext(WalletContext)
  const youSubmitted = localStorage.getItem("submitted");
  const [allProposals, setAllProposals] = useState([]);
  const [submitWarnText, setSubmitWarnText] = useState(
    "Your Project has been Submitted"
  );

  const apiKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQwOTM1MmIyMDgzMzAyNjRBNmJlMjg3NzA2RjdiNzVGZkE3MTdlN2IiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTAzMTYyNDE3NCwibmFtZSI6IlBsZWFybiJ9.rOhiUDXANQt_KLmFeT4R5xY-_fBp4DuJ8HKgWCqCkFQ";

  const client = new NFTStorage({ token: apiKey });
  // const ManagementContractAddress = "0x9Ffe65ca50985eE803cA8C03D4848C979604f459";

  const startReceivingProposals = async () => {
    try {
      if (!receivingProposals) {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const managemente = new ethers.Contract(
            contractAddress.ManagementContractAddress,
            MamangementAbi.abi,
            signer
          );

          await managemente.startReceivingProposals();
          setReceivingProposals(true);
          alert("done");
        }
      } else {
        alert("already triggered start receiving proposals");
      }
    } catch (e) {
      alert(e);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !projectname ||
      !category ||
      !description ||
      !link ||
      !amount ||
      !founder
    ) {
      alert("incomplete fields");
      return;
    }

    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const managemente = new ethers.Contract(
          contractAddress.ManagementContractAddress,
          MamangementAbi.abi,
          signer
        );

        let notEligible = await managemente.checkIfUserAlreadySubmittedProposal(
          account
        );

        if (notEligible) {
          alert("you already submitted a project");
          return;
        }

        let check = await managemente.checkIfNameExists(projectname);
        console.log(check);
        if (check) {
          alert("project name already exists");
          return;
        }

        let proposalObject = {
          projectname,
          category,
          description,
          link,
          amount,
          founder,
          votes,
        };

        let url = await prepareProjectUrl(proposalObject);

        // setSubmitting(true);

        // const names = allProposals.map(({ projectname }) => projectname.S);
        // const senders = allProposals.map(({ sender }) => sender.S.toLowerCase());

        // current account has submitted a project before
        // console.log('aaa')
        // if (senders.includes(account)) {
        //   setSubmitWarnText("You already submitted a project")
        //   alert(submitWarnText)
        //   setSubmitted(true)
        //   localStorage.setItem("submitted", true)
        //   return;
        // }

        // // project name already exists
        // if (names.includes(projectname)) {
        //   return alert("Project Name already exists")
        // } else {

        const manageTrx = await managemente.submitProposal(projectname, url);
        manageTrx.wait();

        await managemente.on("proposalSubmitted", (id, sender) => {
          console.log(id);
        });

        alert("done");
      }
    } catch (err) {
      alert(err);
      console.log(err);
    }
    // }
  };

  const prepareProjectUrl = async (proposalObject) => {
    try {
      if (projectname !== null && projectname !== "") {
        const metadata = new Blob([JSON.stringify(proposalObject)], {
          type: "application/json",
        });

        const cid = await client.storeBlob(metadata);
        console.log(cid);
        let url = cid.toString();
        return url;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => setCategory(e.target.value);

  // useEffect(() => {

  //   // get proposals
  //   awsDb.scan({ TableName: "proposals" }, function (err, { Items }) {
  //     setAllProposals(Items)
  //   })

  //   if (youSubmitted) { setSubmitted(true) }
  // }, [management])

  // useEffect(() => {
  //   if (!newProposalId || !newProposalSender) return

  //   setSubmitting(false)
  //   setSubmitted(true)

  //   awsDb.putItem({
  //     TableName: 'proposals',
  //     Item: {
  //       id: {
  //         S: (Math.floor(Math.random() * 101000100) + 10).toString()
  //       },
  //       proposalId: {
  //         S: `${newProposalId}`
  //       },
  //       sender: {
  //         S: newProposalSender
  //       },
  //       projectname: {
  //         S: projectname.toString()
  //       },
  //       category: {
  //         S: category.toString(),
  //       },
  //       description: {
  //         S: description.toString(0)
  //       },
  //       link: {
  //         S: link.toString()
  //       },
  //       founder: {
  //         S: founder.toString()
  //       },
  //     }
  //   }, function (err, data) {
  //     if (err) {
  //       console.log(err);
  //     }
  //     else {
  //       console.log('great success: %j', data);
  //     }
  //   });

  //   localStorage.setItem("submitted", true)
  // }, [newProposalId, newProposalSender])

  return (
    <>
      <div className="py-2"></div>
      <div className="es-container px-3 gap-24 lg:px-20 pb-10 lg:mt-20 flex flex-col lg:flex-row">
        <div className="mb-10 lg:w-2/4">
          <Title
            text={`ESGROW`}
            size={"text-6xl"}
            customStyles={``}
            underline
          />

          {/* <h3 className="text-md text-black font-bold mt-10">
            A launchpad for users to submit their own ESG projects, participate
            in crowdfunding through voting, minting NFTs and Raising funds.
          </h3> */}
          <h2 className="mt-10 text-2xl text-[#ffffff]">
            Let's save our mother earth and
            <span className="inline-block mx-1 text-white font-bold es-medium-font">
              ESGROW
            </span>
            together!
          </h2>

          <div className="mt-10">
            <Link to="/rules">
              <div
                className="inline-flex bg-amber-100 p-6 rounded-lg items-center"
                onClick={() => {
                  document
                    .getElementById("rules")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Title
                  text={`See Participation Rules`}
                  size="text-2xl"
                  customStyles={`text- lg md: text -xl text-gray-800 `}
                />
                <span className=" text-red-600 ml-2 text-2xl">
                  <RuleIcon />
                </span>
              </div>
            </Link>
            <div className="mt-10">
              <button
                type="button"
                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-6 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={() => startReceivingProposals()}
              >
                Start Receiving Proposals
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <div className="bg-[#FFFfff] px-5 py-10 rounded">
            {!submitted ? (
              <form {...{ onSubmit }}>
                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">Project Name</div>
                  <div className="w-full mt-2">
                    <input
                      type="text"
                      className="bg-[#FFECD7] outline-none border text-gray-800  text-sm block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Esg project name"
                      defaultValue={projectname}
                      required
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">Category</div>
                  <div className="w-full mt-2">
                    <select
                      name="cars"
                      className="w-full p-4 overflow-hidden bg-[#FFECD7] outline-none"
                      onChange={handleChange}
                    >
                      <option
                        value="S-WOMEN-INCLUSION"
                        className="w-40 py-4 bg-white px-3"
                      >
                        S-WOMEN INCLUSION
                      </option>
                      <option
                        value="E-CLEAN-FORESTS"
                        className="w-40 py-4 bg-white px-3"
                      >
                        E-CLEAN FORESTS
                      </option>
                      <option
                        value="E-SAVE-THE-MAMMALS"
                        className="w-40 py-4 bg-white px-3"
                      >
                        E-SAVE THE MAMMALS
                      </option>
                      <option
                        value="E-CLIMATE-CHANGE-AND-CARBON-EMISSION"
                        className="w-40 py-4 bg-white px-3"
                      >
                        E-CLIMATE CHANGE AND CARBON EMISSION
                      </option>
                      <option
                        value="S-COMMUNITY-RELATIONS"
                        className="w-40 py-4 bg-white px-3"
                      >
                        S-COMMUNITY RELATIONS
                      </option>
                      <option
                        value="G-VOTING-SYSTEM"
                        className="w-40 py-4 bg-white px-3"
                      >
                        G-VOTING-SYSTEM
                      </option>
                      <option
                        value="E-HUMAN-RIGHTS"
                        className="w-40 py-4 bg-white px-3"
                      >
                        E-HUMAN-RIGHTS
                      </option>
                      <option
                        value="E-CLIMATE-CHANGE"
                        className="w-40 py-4 bg-white px-3"
                      >
                        E-CLIMATE-CHANGE
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">Brief Description</div>
                  <div className="w-full mt-2">
                    <input
                      type="text"
                      className="bg-[#FFECD7] outline-none border text-gray-800  text-sm block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Esg Project Description"
                      required
                      defaultValue={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">
                    Link to Project and Main Documents
                  </div>
                  <div className="w-full mt-2">
                    <input
                      defaultValue={link}
                      type="text"
                      className="bg-[#FFECD7] outline-none border text-gray-800 text-sm block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="www.website.com"
                      required
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">Amount to Raise</div>
                  <div className="w-full mt-2">
                    <input
                      defaultValue={amount}
                      type="number"
                      className="bg-[#FFECD7] outline-none border text-gray-800  text-sm block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Your Name"
                      required
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center flex-col mb-6">
                  <div className="w-full font-normal">Founder Name</div>
                  <div className="w-full mt-2">
                    <input
                      defaultValue={founder}
                      type="text"
                      className="bg-[#FFECD7] outline-none border text-gray-800  text-sm block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Your Name"
                      required
                      onChange={(e) => setFounder(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    className="bg-[#5B9981] py-3 px-16 rounded text-[#fffbee]"
                    disabled={submitting}
                  >
                    {/* {youSubmitted ? "You already Submitted a Project" : "Submit"} */}
                    Submit
                  </button>
                </div>
              </form>
            ) : null}
            {submitted ? (
              <div className="h-96 flex items-center justify-center flex-col">
                <div className="flex items-center justify-center flex-col">
                  <img src={CheckMark} alt="Submitted" className="w-20" />
                  <div className="font-bold my-3">{submitWarnText}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

const CollectionsLoader = () => {
  return (
    <div className="es-container pt-2 px-3 lg:px-20 pb-10 lg:mt-20">
      <div>
        <section class="text-gray-600 body-font">
          <div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <div class="text-center lg:w-2/3 w-full">
              <p class="mb-8 text-xl leading-relaxed">
                It is empty in here 😪 , no projects available for funding
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Submit;
