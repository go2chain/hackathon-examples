pragma solidity ^0.4.16;

library MathLib {
  function addToBalance(uint _amount, uint _money) public pure returns (uint newBalance) {
    return _amount + _money;
  }
}
