// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

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
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract Management is KeeperCompatibleInterface, Context{
 using Counters for Counters.Counter;

 Counters.Counter private proposalId;
 enum State { NOT_STARTED, RECEIVING_PROPOSALS, VOTING, RESULT_READY }

 State state;

 uint votingTimeLength;
 uint proposalTimeLength;
 uint proposalStartTime;
 uint voteStartTime;


//events
event proposalSubmitted(uint id, address sender);
event votingStarted(uint time);
event userVoted(uint id, address sender);
event userVotedAgain(uint id, address sender);
event resultReady(uint time);

 uint private maxNumberOfProposals;

    struct Proposal{
        uint id;
        string name;
        string founders;
        address sender;
        uint time;
    }
  

 IERC20 mani;
  Proposal proposal;
  mapping(uint => Proposal)  proposals;
  mapping(address => bool) submittedProposal;
  mapping(uint => uint) voteCount;
  mapping(uint =>bool) isproposal;
  mapping(address => bool) voted;
  mapping(address => bool) votedAgain;

  constructor(uint _maxNumbersOfProposals, address token_Address, uint proposalTimeFrame, uint votingTimeFrame){
      maxNumberOfProposals = _maxNumbersOfProposals;
      state = State.RECEIVING_PROPOSALS;
      mani = IERC20(token_Address);
      votingTimeLength = votingTimeFrame;
      proposalTimeLength = proposalTimeFrame;
      proposalStartTime = block.timestamp;
  }

modifier onlyValidIds(uint id){
    require(isproposal[id],"id is not a proposal");
    _;
}

//
  function submitProposal(string  memory _name, string memory _founders) external returns(uint){
      //please ensure string is not empty
    require(state == State.RECEIVING_PROPOSALS,"not receiving proposals");
    require(!submittedProposal[_msgSender()],"you already submitted a proposal");
    proposalId.increment();
    uint id = proposalId.current();
    require(id<=maxNumberOfProposals,"maximum numbers of allowed proposals reached");
    uint time = block.timestamp;
    Proposal memory newProposal = Proposal(id,_name,_founders,_msgSender(),time);
    proposals[id] = newProposal;
    submittedProposal[_msgSender()] = true;
    isproposal[id] = true;
    emit proposalSubmitted(id,_msgSender());
    return id;
  }

  
  function voteProposal(uint id) external onlyValidIds(id) returns(bool) {
     require(state == State.VOTING,"not receiving votes");
     require(!votedAgain[_msgSender()],"you have used up your votes");
     uint i = 0;
    if(voted[_msgSender()]){
        votedAgain[_msgSender()] = true;
        i = 2;
    }
    else{
        voted[_msgSender()] = true;
        i = 1;
    }

     mani.transferFrom(_msgSender(),address(this),1 ether);
     voteCount[id] = voteCount[id] + 1;
    
    if(i==1){
        emit userVoted(id,_msgSender());
    }
    else{
        emit userVotedAgain(id,_msgSender());
    }
    return true;
  }


  function getResult() public view returns(uint[] memory){
      require(state == State.RESULT_READY,"not providing results");
      uint lastProposal = proposalId.current();
      uint[] memory results = new uint[](lastProposal);
      for(uint i = 1; i<=lastProposal;){
       results[i] = voteCount[i];
          unchecked{
              ++i;
          }
      }
      return results;
  }

 function getSingleProposalResult(uint id) public view onlyValidIds(id) returns(uint){
     return voteCount[id];
 }

 function getWinners() public view returns(uint [] memory){
     uint[] memory results = getResult();

     return results;

 }


 //keepers at work
   function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        if(state == State.RECEIVING_PROPOSALS) {upkeepNeeded = (block.timestamp - proposalStartTime) > proposalTimeLength;}
        else{
            if(state == State.VOTING){
                upkeepNeeded = (block.timestamp - voteStartTime) > votingTimeLength;
            }
        }
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
       if(state == State.RECEIVING_PROPOSALS){ 
           if ((block.timestamp - proposalStartTime) > proposalTimeLength ) {
            state = State.VOTING;
            voteStartTime = block.timestamp;
            emit votingStarted(voteStartTime);
        }
       }
       else{
           if(state == State.VOTING){
                if ((block.timestamp - voteStartTime) > votingTimeLength ) {
            state = State.RESULT_READY;
            emit resultReady(block.timestamp);
           
        }
           }
       }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    function getCurrentState() external view returns(State){
        return state;
    }


}
