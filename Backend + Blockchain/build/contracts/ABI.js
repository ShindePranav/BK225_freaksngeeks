
const path = require('path')
///////Folow This
const fs = require('fs');
const Web3=require('web3');

let itData = fs.readFileSync(path.join(__dirname+'/IssueTender.json'),(err, data) => { 
    console.log(data); 
 }) ;
let it= JSON.parse(itData);
let ccData = fs.readFileSync(path.join(__dirname+'/ContractConfirmation.json'));
let cc= JSON.parse(ccData);
let qaData = fs.readFileSync(path.join(__dirname+'/QA.json'));
let qa= JSON.parse(qaData);
let abData = fs.readFileSync(path.join(__dirname+'/AcceptBid.json'));
let ab= JSON.parse(abData);
let scData = fs.readFileSync(path.join(__dirname+'/shipmentContract.json'));
let sc= JSON.parse(scData);

let plData = fs.readFileSync(path.join(__dirname+'/PaymentLog.json'));
let pl= JSON.parse(plData);
//let abData = fs.readFileSync('../build/contracts/Shipping.json');
//console.log(data['abi'])

//////BLOCKCHAIN
var web3 = new Web3("http://127.0.0.1:9545/");
var contract;
    web3 = new Web3(web3.currentProvider);
//Build Contract
//console.log(qa['networks']['5777']['address'])

module.exports.issueTenderContract= new web3.eth.Contract(it['abi'],it['networks']['5777']['address']);
module.exports.shipmentContract= new web3.eth.Contract(sc['abi'],sc['networks']['5777']['address']);
module.exports.conConfContract =  new web3.eth.Contract(cc['abi'],cc['networks']['5777']['address']);
module.exports.acceptBidContract =  new web3.eth.Contract(ab['abi'],ab['networks']['5777']['address']);
module.exports.paymentLogContract =  new web3.eth.Contract(pl['abi'],pl['networks']['5777']['address']);
module.exports.gas1=470000;
module.exports.gasPrice1=8000000;
module.exports.qAContract =  new web3.eth.Contract(qa['abi'],qa['networks']['5777']['address']);