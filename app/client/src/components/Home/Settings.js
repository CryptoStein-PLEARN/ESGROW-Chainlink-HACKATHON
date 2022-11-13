import { useContext, useEffect, useState } from 'react'
import { WalletContext } from '../../context/WalletContext'

const Settings = () => {

    const {
        management,
        manitoken,
        maxProposals,
        proposalTimeFrame,
        votingTimeFrame,
        setMaxProposals,
        setProposalTimeFrame,
        setVotingTimeFrame,
        proposalMilliSeconds,
        votingMilliSeconds,
        setProposalMilliSeconds,
        setVotingMilliSeconds,
    } = useContext(WalletContext)

    const startAcceptingProposals = async () => {
        await management.startReceivingProposals(); //? from the form section
        console.log('started accepting proposals')
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        await startAcceptingProposals();

    }

    useEffect(() => {
        setProposalMilliSeconds(proposalTimeFrame * 60 * 1000)//?divide by 1000 then 60 to return minute
        setVotingMilliSeconds(proposalTimeFrame * 60 * 1000);
    }, [proposalTimeFrame, votingTimeFrame])

    console.log(proposalMilliSeconds, votingMilliSeconds)


    return (
        <div className="es-container mt-20 px-3 lg:px-20 pb-10 lg:mt-20 relative">
            <div className='mx-auto md:w-8/12'>
                <div className='flex justify-evenly'>
                    <div>
                        <h2 className='font-bold text-sm'>Maximum No. of Proposals</h2>
                        <h3>{maxProposals ? maxProposals : null}</h3>
                    </div>
                    <div>
                        <h2 className='font-bold text-sm'>Proposal Timeframe</h2>
                        <h3>{proposalTimeFrame ? proposalTimeFrame : null}</h3>
                    </div>
                    <div>
                        <h2 className='font-bold text-sm'>Voting Timeframe</h2>
                        <h3>{votingTimeFrame ? votingTimeFrame : null}</h3>
                    </div>
                </div>
            </div>

            <form className='mx-auto md:w-8/12 mt-20' {...{ onSubmit }}>
                <div class="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Maximum Proposals</label>
                    <input disabled defaultValue={maxProposals} onChange={(e) => setMaxProposals(parseInt(e.target.value))} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0 - 50" required="" />
                </div>
                <div class="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Proposal Timeframe</label>
                    <input disabled defaultValue={proposalTimeFrame} onChange={(e) => setProposalTimeFrame(parseInt(e.target.value))} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='0 - 100' required="" />
                </div>

                <div class="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Voting Timeframe</label>
                    <input disabled defaultValue={votingTimeFrame} onChange={(e) => setVotingTimeFrame(parseInt(e.target.value))} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='0 - 100' required="" />
                </div>

                <button type="submit" className="text-white bg-black px-6 py-4 rounded-sm">Start Accepting Proposals</button>
            </form>

        </div >
    )
}

export default Settings