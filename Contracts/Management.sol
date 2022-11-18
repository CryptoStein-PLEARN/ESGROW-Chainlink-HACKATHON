// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

//proposals

//@dev to ensure string input to submit proposal is not empty
//@dev to figure out another way to ensure users vote once
//@dev to get results for winners
//@dev to emit

//vote
//mint

import "../utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/IMani.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract Management is KeeperCompatibleInterface, Context {
    using Counters for Counters.Counter;

    Counters.Counter private proposalId;
    enum State {
        NOT_STARTED,
        RECEIVING_PROPOSALS,
        VOTING,
        RESULT_READY
    }

    State state;

    string stateUrl;

    uint256 votingTimeLength;
    uint256 proposalTimeLength;
    uint256 proposalStartTime;
    uint256 voteStartTime;

    //events
    event proposalStarted(uint256 time);
    event proposalSubmitted(uint256 id, address sender);
    event votingStarted(uint256 time);
    event userVoted(uint256 id, address sender);
    event userVotedAgain(uint256 id, address sender);
    event resultReady(uint256 time);
    event finalResult(uint256[] result);

    uint256 private maxNumberOfProposals;
    address private tokenAddress;
    address private manager;

    struct Proposal {
        uint256 id;
        string name;
        string category;
        string founders;
        uint256 amount;
        address sender;
        uint256 time;
    }

    IMani mani;
    Proposal proposal;
    mapping(uint256 => Proposal) proposals;
    mapping(address => bool) submittedProposal;
    mapping(uint256 => uint256) voteCount;
    mapping(uint256 => bool) isproposal;
    mapping(address => bool) voted;
    mapping(address => bool) votedAgain;
    mapping(string => bool) nameExists;

    constructor(
        uint256 _maxNumbersOfProposals,
        address token_Address,
        uint256 proposalTimeFrame,
        uint256 votingTimeFrame
    ) {
        maxNumberOfProposals = _maxNumbersOfProposals;
        mani = IMani(token_Address);
        tokenAddress = token_Address;
        votingTimeLength = votingTimeFrame;
        proposalTimeLength = proposalTimeFrame;
        manager = _msgSender();
        state = State.NOT_STARTED;
    }

    modifier onlyValidIds(uint256 id) {
        require(isproposal[id], "id is not a proposal");
        _;
    }

    modifier onlyManager() {
        require(
            _msgSender() == manager,
            "not authorized to call this function"
        );
        _;
    }

    //@dev to trigger function for contract to start receiving proposals
    function startReceivingProposals() external onlyManager {
        proposalStartTime = block.timestamp;
        state = State.RECEIVING_PROPOSALS;
        emit proposalStarted(proposalStartTime);
    }

    function checkIfNameExists(string memory _name)
        external
        view
        returns (bool)
    {
        return (nameExists[_name]);
    }

    function checkIfUserAlreadySubmittedProposal(address _address)
        external
        view
        returns (bool)
    {
        return (submittedProposal[_address]);
    }

    function submitProposal(
        string memory _name,
        string memory _category,
        string memory _founders,
        uint256 _amount
    ) external returns (uint256) {
        //please ensure string is not empty
        require(state == State.RECEIVING_PROPOSALS, "not receiving proposals");
        require(
            !submittedProposal[_msgSender()],
            "you already submitted a proposal"
        );
        require(!nameExists[_name], "proposal name already exists");
        proposalId.increment();
        uint256 id = proposalId.current();
        require(
            id <= maxNumberOfProposals,
            "maximum numbers of allowed proposals reached"
        );
        uint256 time = block.timestamp;
        Proposal memory newProposal = Proposal(
            id,
            _name,
            _category,
            _founders,
            _amount,
            _msgSender(),
            time
        );
        proposals[id] = newProposal;
        submittedProposal[_msgSender()] = true;
        nameExists[_name] = true;
        isproposal[id] = true;
        emit proposalSubmitted(id, _msgSender());
        return id;
    }

    function voteProposal(uint256 id) external onlyValidIds(id) returns (bool) {
        require(state == State.VOTING, "not receiving votes");
        require(!votedAgain[_msgSender()], "you have used up your votes");
        uint256 i = 0;
        if (voted[_msgSender()]) {
            votedAgain[_msgSender()] = true;
            i = 2;
        } else {
            voted[_msgSender()] = true;
            i = 1;
        }

        mani.transferFrom(_msgSender(), tokenAddress, 1 ether);
        voteCount[id] = voteCount[id] + 1;

        if (i == 1) {
            emit userVoted(id, _msgSender());
        } else {
            emit userVotedAgain(id, _msgSender());
        }
        return true;
    }

    function getResult() public view returns (uint256[] memory) {
        require(state == State.RESULT_READY, "not providing results");
        uint256 lastProposal = proposalId.current();
        uint256[] memory results = new uint256[](lastProposal);
        for (uint256 i = 1; i <= lastProposal; ) {
            // if i = 0, votcount will be 0 also
            results[i] = voteCount[i];
            unchecked {
                ++i;
            }
        }
        return results;
    }

    function getSingleProposalResult(uint256 id)
        public
        view
        onlyValidIds(id)
        returns (uint256)
    {
        return voteCount[id];
    }

    //keepers at work
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        if (state == State.RECEIVING_PROPOSALS) {
            upkeepNeeded =
                (block.timestamp - proposalStartTime) > proposalTimeLength;
        } else {
            if (state == State.VOTING) {
                upkeepNeeded =
                    (block.timestamp - voteStartTime) > votingTimeLength;
            }
        }
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if (state == State.RECEIVING_PROPOSALS) {
            if ((block.timestamp - proposalStartTime) > proposalTimeLength) {
                state = State.VOTING;
                voteStartTime = block.timestamp;
                emit votingStarted(voteStartTime);
            }
        } else {
            if (state == State.VOTING) {
                if ((block.timestamp - voteStartTime) > votingTimeLength) {
                    state = State.RESULT_READY;
                    emit resultReady(block.timestamp);
                    // emit finalResult(getResult());
                }
            }
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    function getCurrentState() external view returns (State) {
        return state;
    }

    function getlastProposal() external view onlyManager returns (uint256) {
        return proposalId.current();
    }

    function retrieveVoteTokens() external onlyManager {
        require(state == State.RESULT_READY, "voting process not done");
        address[] memory registeredAddresses = mani.getRegisteredAddresses();
        for (uint256 i = 0; i <= registeredAddresses.length; ) {
            if (!votedAgain[registeredAddresses[i]]) {
                if (voted[registeredAddresses[i]]) {
                    if (mani.balanceOf(registeredAddresses[i]) >= 1 ether) {
                        mani.transferFrom(
                            registeredAddresses[i],
                            tokenAddress,
                            1 ether
                        );
                    }
                } else {
                    if (mani.balanceOf(registeredAddresses[i]) >= 2 ether) {
                        mani.transferFrom(
                            registeredAddresses[i],
                            tokenAddress,
                            2 ether
                        );
                    } else {
                        if (mani.balanceOf(registeredAddresses[i]) >= 1 ether) {
                            mani.transferFrom(
                                registeredAddresses[i],
                                tokenAddress,
                                1 ether
                            );
                        }
                    }
                }
            }
        }
    }

    function manuallyStartVoting() external onlyManager {
        require(state == State.RECEIVING_PROPOSALS, "not receiving proposals");
        require(
            (block.timestamp - proposalStartTime > proposalTimeLength),
            " not yet time"
        );
        state = State.VOTING;
        voteStartTime = block.timestamp;
        emit votingStarted(voteStartTime);
    }

    function manuallyEndVoting() external onlyManager {
        require(state == State.VOTING, "not voting");
        require(
            (block.timestamp - voteStartTime > votingTimeLength),
            "not yet time"
        );
        state = State.RESULT_READY;
        emit resultReady(block.timestamp);
        // emit finalResult(getResult());
    }

    function setStateUrl(string memory newUrl) external {
        stateUrl = newUrl;
    }

    function getStateUrl() external view returns (string memory) {
        return stateUrl;
    }
}
