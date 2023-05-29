// migrations/2_deploy_contract.js
const MyNFT = artifacts.require("./MyNFT.sol");

module.exports = function (deployer) {
  deployer.deploy(MyNFT);
};
