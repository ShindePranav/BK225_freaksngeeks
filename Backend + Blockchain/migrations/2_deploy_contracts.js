const issueTender = artifacts.require("IssueTender.sol");
const acceptBid=artifacts.require("AcceptBid.sol");
const contractConfirmation= artifacts.require("ContractConfirmation.sol");
const qa= artifacts.require("QA.sol");
const pl= artifacts.require("PaymentLog.sol");
const shipmentC= artifacts.require("shipmentContract.sol");
const {procurementManagerAddress,projectEnggAddress,qualityAssuranceAddress}=require('../common/blockchainaccounts')

module.exports = function(deployer) {
  deployer.deploy(issueTender,{from:procurementManagerAddress});
  deployer.deploy(acceptBid,{from:projectEnggAddress});
  deployer.deploy(contractConfirmation,{from:projectEnggAddress});
  deployer.deploy(qa,{from:qualityAssuranceAddress});
  deployer.deploy(pl,{from:projectEnggAddress});
  deployer.deploy(shipmentC);

};
