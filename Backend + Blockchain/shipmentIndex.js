const Web3 = require('web3');
const Quality = require('./build/contracts/quality.json');
//const init = async()=>{

//const web3 = new Web3('http://127.0.0.1:9545/');
let web3;

const initWeb3 = async() => {
    return new Promise((resolve, reject) => {
      if(typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        window.ethereum.enable()
          .then(() => {
            resolve(
              new Web3(window.ethereum)
            );
          })
          .catch(e => {
            reject(e);
          });
        return;
      }
      if(typeof window.web3 !== 'undefined') {
        return resolve(
          new Web3(window.web3.currentProvider)
        );
      }
      resolve(new Web3('http://localhost:9545'));
    });
  
const id = await web3.eth.net.getId();
const deployedNetwork = Quality.networks[id];
const contract = new web3.eth.Contract(
    Quality.abi, address
);

const addresses =await web3.eth.getAccounts();
const res = await contract.methods.setTenderDetails().call() 
//getAllQNAKeys
console.log.res;

const res1 = await contract.methods.addQNA(_contractId, _tenderRefNum,_contractAppovalDate,_value,_vendor,_scheduledDeliveryDate,_actualDeliverDate,
  _DeliveryPerformance, _QualityPerformance, _ReliabilityPerformance).send({from:addresses[0],});

  //var contract1 = new eth.Contract(abi, address, {gasPrice: '12345678'});
  const res = await contract.methods.getAllQNAKeys().call() 


console.log.res1;

const res2 = await contract.methods.getBasicQNA(_contractId) 

console.log.res2;

const res4 = await contract.methods.getperformance(total).call
}



const express =require('express')
const app =express();

app.get('/',(req,res)=>{
	//if(req){
		//console.log(req.user.name)
		//res.sendFile('index.html')
		res.sendFile(__dirname + '/index.html')
//,{
      //  root: path.join(__dirname, '../views')
    //});
	//}else{
	//	res.status(404).send('Nothing Found on server Please Change The Request');
	//}
}
)

const Port = process.env.PORT || 3000;
app.listen(Port,()=> {
	console.log(`Listening Dude Feel Safe at ${Port}`);
	(async function(){
		const endpoint= await ngrok.connect(Port);
		console.log(' ${endpoint}' )
	})

});

