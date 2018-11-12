var MathLib = artifacts.require("./MathLib.sol");
var SimpleBank = artifacts.require("./SimpleBank.sol");

module.exports = function(deployer) {
  deployer.deploy(MathLib);
  deployer.link(MathLib, SimpleBank);
  deployer.deploy(SimpleBank);
};
