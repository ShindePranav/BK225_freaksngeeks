
 // INput->>>>>Length for of unique id to be generated and possible long string output-->uniqueid
 const randomString = function(length,possible) {
			
    var text = "";

   // var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   // var possible="vaibhavivalmikjadhav123456789"
    for(var i = 0; i < length; i++) {
    
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    }
    
    return text;
}
/************************************************************************ */
// input Arrray----->list myarray[], output---->sorted array[]
const sortArray=function(needle,myArray){
   const ans= myArray.sort((a, b) => {
        return Math.abs(needle - a) - Math.abs(needle - b);
    
    })
    return ans;
    }
   
const Web3=require('web3');
const ethers=require('ethers')
const { account, qualityAssuranceAddress } = require('./blockchainaccounts');
const {gas1,gasPrice1}=require('../build/contracts/ABI')
const {procurementManagerAddress,issueTenderContract}=require('../build/contracts/ABI');
//////BLOCKCHAIN

var web3 = new Web3("http://127.0.0.1:9545/");
var count=5;
const  createNewAccount=function(){
  var account= web3.eth.accounts.create();
   
     let add= account.address
     return add
  
  }
  const  getAccountBalance=function(add){
	
    let bal=web3.eth.getBalance(add);
	//let key= account.privateKey;
	return bal;//{add,key};
  }
  const sendMoney=function(from,to){

    return web3.eth.sendTransaction({from: from, to:to, value: web3.utils.toWei('10', 'ether'), gasLimit: 21000, gasPrice: 20000000000})
    .then((err)=>{console.log(err);return true},(e)=>{console.log(e);return false})
  }
  const paymentTransaction=function(from,to,amount){
    
   //var token=web3.utils.toWei(amount.toString() ,'ether')
    return web3.eth.sendTransaction({from: from, to:to, value:web3.utils.toWei('10', 'ether'), gasLimit:5000000000000, gasPrice: 2000000000 })
    .then((err)=>{return err},(err)=>{return err})

  }
  const updateTenderStatus= async function(ref,state){
	
    const tender= await issueTenderContract.methods.updateStatus(ref,state);//,{from : qualityAssuranceAddress,gas: gas1,gasPrice:gasPrice1});
  
    return tender
  }

exports.updateTenderStatus=updateTenderStatus
exports.paymentTransaction=paymentTransaction
exports.sendMoney=sendMoney;
exports.getAccountBalance=getAccountBalance;
exports.createNewAccount=createNewAccount
exports.sortArray=sortArray;
exports.uniqueid=randomString;
 