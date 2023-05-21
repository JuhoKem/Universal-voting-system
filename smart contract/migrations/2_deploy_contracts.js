// Migrate the contract
var VotingContract = artifacts.require("./VotingContract.sol");
 
module.exports = function(deployer)
{
  deployer.deploy(VotingContract);
};