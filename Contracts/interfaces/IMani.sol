// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMani is IERC20 {
    function getRegisteredAddresses() external view returns (address[] memory);
}
