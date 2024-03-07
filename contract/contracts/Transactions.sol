// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 tCount;
    event Transfer(address from, address to, uint amount, string message, uint256 timestamp, string keyword);

    struct s_Transfer {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    s_Transfer[] transactions;

    function addBlock(address payable receiver, uint amount, string memory message, string memory keyword) public {
        tCount += 1;
        transactions.push(s_Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword));
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAll() public view returns (s_Transfer[] memory) {
        return transactions;
    }
    
    function getCount() public view returns (uint256) {
        return tCount;
    }
}
