pragma solidity ^0.4.19;

contract SimpleHash {
  string ipfsHash;

  event HashUpdated(string newHash);

  constructor(){
    ipfsHash = "QmYUJmhBYrrgKBJpiq4XJWQgPGTmRDeAtAeLm8xswk5NvF";
  }

  function sendHash(string x) public {
    ipfsHash = x;

    emit HashUpdated(x);
  }

  function getHash() public view returns (string x) {
    return ipfsHash;
  }
}