import React from "react";
import Crtlg from "../../images/logo.png";
const Privacy = () => {
  
  return (
    <div className="container flex items-center justify-center flex-col text-justify mx-auto w-2/3  sm:w-2/3 mt-10 text-gray-800 ">
      <div className="bg-[#F5F5DC]  pt-10 pl-5 pr-5   shadow-lg flex-col">
       
        <h1 className="text-center text-2xl font-bold text-gray-900 ">
          PARTICIPATION RULES
        </h1>
        <section id="rules" className="mb-5">
        <div className="py-2"></div>
        <div className="es-container px-3 lg:px-20 pb-10">
          
          <div className="pl-4">


            <h2 className=" text-xl font-bold uppercase mb-2">
              ESGrow Participation

            </h2>
            <div className=" mt-2">
              Participation is open to the public and anyone with ESG-related
              idea can participate and submit their own idea.
            </div>

            <div className="py-2"></div>
            <h2 className=" text-xl font-bold uppercase mb-2">
              Dates and Timing (Just assumptions here)
            </h2>
            <ul className="pl-2 ">
              <li className="mb-5">
                1. Submission Period: October 1, 2022 (10:00 am Eastern Time) –
                November 22, 2022 (5:00 pm Eastern Time) (“Submission Period”)
              </li>

              <li className="mb-5">
                2. Voting: November 25, 2022 (10:00 am Eastern Time) – December
                1, 2022 (5:00 pm Eastern Time)
              </li>

              <li>
                3. Winners Announced: On or around December 9, 2022 (2:00 pm
                Eastern Time). Updated July 21*
              </li>
            </ul>

            <div className="py-2"></div>
            <h2 className=" text-xl font-bold uppercase mb-2">
              Eligibility
            </h2>
            <ul className="pl-2 ">
              <li className="mb-5">Open to the public</li>
              <li className="mb-5">The idea must be ESG-related</li>
              <li>It should fall under one of the main listed categories.</li>
            </ul>
          </div>
        </div>

        <div className="es-container px-3 lg:px-20 pb-10">
          <h2 className=" text-2xl font-bold mb-6">Submission</h2>
          <div className="pl-4">
            <h2 className=" text-xl font-bold uppercase mb-2">
              Submission Requirements
            </h2>
            <ul className="pl-2 ">
              <li className="mb-5">Founder's names</li>

              <li className="mb-5">Submit the name of the project</li>

              <li className="mb-5">Choose the ESG- related category</li>

              <li className="mb-5">Brief description on the idea</li>

              <li>
                Link to the project and main documents (ex, whitepaper, pitch
                deck…etc)
              </li>
            </ul>

            <div className="py-2"></div>
            <h2 className=" text-xl font-bold uppercase mb-2">
              Language Requirements
            </h2>
            <div className=" mt-2">
              All Submission materials must be in English or, if not in English,
              the Entrant must provide an English translation of text
              description, and testing instructions as well as all other
              materials submitted.
            </div>
          </div>
        </div>

        <div className="es-container px-3 lg:px-20 pb-10">
          <h2 className=" text-2xl font-bold mb-6">Voting</h2>
          <div className="pl-4">
            <div className=" mt-2">
              Projects will be subject to the community voting system. Community
              member, once the projects are submitted and after the submission
              period, will be able to check all the projects and start voting.
              Each community member will only have two votes; meaning that they
              can only vote for maximum of two projects or can vote twice for
              the same project.
            </div>
          </div>
        </div>

        <div className="es-container px-3 lg:px-20 pb-10">
          <h2 className=" text-2xl font-bold mb-6">
            Results announcement
          </h2>
          <div className="pl-4">
            <ul className="pl-2 ">
              <li className="mb-5">
                After the voting period deadline, the number of votes will be
                displayed on the dashboard so all community can see the results
                and winning projects
              </li>

              <li className="mb-5">
                Winners will be asked to submit their documents and 5 LinkedIn
                profiles
              </li>

              <li className="mb-5">
                Winners will be invited to an interview with ESGROW team to
                introduce themselves
              </li>
            </ul>
          </div>
        </div>

        <div className="es-container px-3 lg:px-20">
          <h2 className=" text-2xl font-bold mb-6">Funding</h2>
          <div className="pl-4">
            <ul className="pl-2 ">
              <li className="mb-5">
                Funding projects will be split into 3 phases:
                <ol className="mt-4">
                  <li className="mb-5">
                    30% to fund the project's first phase
                  </li>

                  <li className="mb-5">
                    40% to fund the project's second phase
                  </li>

                  <li className="mb-5">
                    30% to fund the project's 3rd and last phase
                  </li>
                </ol>
              </li>
            </ul>
          </div>
        </div>
        <img class="w-36  mb-5 mt-10 ml-5" alt="my ai logo" src={Crtlg} />
        <div></div>
      </section>
      </div>
    </div>
  );
};

export default Privacy;