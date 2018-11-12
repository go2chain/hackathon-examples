pragma solidity ^0.4.19;

contract SimpleState {

  struct State {
    string message;
    uint timestamp;
  }

  mapping(address => State) public status;

  State public globalState;

  event StateChanged(address indexed account, string message, uint timestamp);
  event StateGlogalChanged(address indexed account, string message, uint timestamp);

  constructor() public {
    globalState.message = "Café con leche in plaza mayor";
    globalState.timestamp = 1542020241443;
  }

  function changeState(string _message, uint _timestamp) public {
    status[msg.sender] = State({message: _message, timestamp: _timestamp});

    emit StateChanged(msg.sender, _message, _timestamp);
  }

  function changeGlobalState(string _message, uint _timestamp, uint _value) public payable {
    require(msg.value >= _value, "Mec, transaction value < value input");

    globalState = State({message: _message, timestamp: _timestamp});

    emit StateGlogalChanged(msg.sender, _message, _timestamp);
  }
}