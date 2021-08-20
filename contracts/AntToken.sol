// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20.sol";

contract AntToken is ERC20 {
    
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_){}

    function mint(address account, uint256 amount) public {
        _mint(account,amount);
    }
}