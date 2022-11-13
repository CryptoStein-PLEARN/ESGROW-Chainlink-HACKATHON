// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IManagement {
    event proposalSubmitted(uint id, address sender);
    event votingStarted(uint time);
    event userVoted(uint id, address sender);
    event userVotedAgain(uint id, address sender);
    event resultReady(uint time);

    function submitProposal(string memory _name, string memory _founders)
        external
        returns (uint);

    function voteProposal(uint id) external returns (bool);

    function getResult() external view returns (uint[] memory);

    function getSingleProposalResult(uint id) external view returns (uint);

    function getWinners() external view returns (uint[] memory);

    function getCurrentState() external view returns (uint);
}
