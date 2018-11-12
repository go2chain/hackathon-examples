pragma solidity ^0.4.19;

import "./MathLib.sol";
import "./Ownable.sol";

contract SimpleBank is Ownable {

  mapping (address => uint) accountsbalances;

  event BalanceUpdated(uint _totalBalance);

  function depositMoney(uint _value) payable public returns (uint) {
    require(msg.value >= _value);

    accountsbalances[msg.sender] = MathLib.addToBalance(accountsbalances[msg.sender], msg.value);

    // Event emit
    emit BalanceUpdated(address(this).balance);

    return accountsbalances[msg.sender];
  }

  function getAccountBalance() public view returns (uint) {
    return accountsbalances[msg.sender];
  }

  function getTotalBalance() public view returns (uint){
    return address(this).balance;
  }

  function withdraw() public onlyOwner{
    msg.sender.transfer(address(this).balance);
  }
}