const express=require('express')
const router=express.Router();
const Joi= require('joi')
const mongoose =require('mongoose')
const {tenderDetailRegistration}=require("../modules/tender-details");
const {BidderRegistration,validateupdateBidderRegistration}=require("../modules/bidder-registration")
const {SubmitedBid}=require('../modules/bidding')
//const nodemailer=require ('nodemailer');
const bcrypt=require('bcrypt');
const Web3=require('web3');
//const {issueTenderABI,issueTenderAddress}=require('../build/contracts/ABI');
const {issueTenderContract}=require('../build/contracts/ABI')
const {TechnicalBid,validateTechnicalBid}=require('../modules/technical')
const {uniqueid}=require('../common/quick')

//////BLOCKCHAIN
var web3 = new Web3("http://127.0.0.1:9545/");
var contract;
    web3 = new Web3(web3.currentProvider);
//Build Contract
//contract =  new web3.eth.Contract(issueTenderABI,issueTenderAddress);

router.get('/view-tenders',async(req,res)=>{
	try{
		//const posts= await tenderDetailRegistration.find();//using limit function after find will get limited database
		//res.json(posts);
		async function getTenders(){
			const ans=await issueTenderContract.methods.viewTenders().call().then(function(res){
				console.log(res);
				return res;
			  //document.getElementById('tenderDetails').innerHTML = res[0]+"    "+res[1]+"    "+res[2]+"    "+res[3]+"    "+res[4];
			})
			console.log(ans)
			return ans
			
		  }
		  const ans = await getTenders()
		  const array= Array()
		  for (var id in ans){
			const tender=await issueTenderContract.methods.viewTender(ans[id]).call().then(function(res){
				return res;
			})

             array.push(tender)
		  }
		  res.send(array)
		

	}catch(err){
		res.json({error:err});
	}
});
router.get('/view-tenders/:tenderId',async(req,res)=>{
	try{
	  // const posts=await tenderDetailRegistration.findOne({tenderId:req.params.tenderId});
	   //res.json(posts);
	   //BlockChain
		async function getTender(){
			const ans=await issueTenderContract.methods.viewTender(req.params.tenderId).call().then(function(res){
				return res;

			  //document.getElementById('tenderDetails').innerHTML = res[0]+"    "+res[1]+"    "+res[2]+"    "+res[3]+"    "+res[4];
			})
			//console.log(ans)
			return ans
			
		  }
		  const ans = await getTender()
	      

		  res.json(ans)
	}catch(err){
		res.json({message:err});
	}
});
router.get('/view-profile/:loginId',async(req,res)=>{
	try{
	//req.user.name
	   const posts=await BidderRegistration.findOne({loginId:req.params.loginId});
	   res.json(posts);
	}catch(err){
		res.json({message:err});
	}
});
router.put('/edit-profile/:loginId',async (req,res)=>{
	const { error }= validateupdateBidderRegistration(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)

	const temp=await BidderRegistration.findOneAndUpdate({loginId:req.params.loginId},
		{$set:req.body},{new:true});
	if(!temp) return res.status(400).send(`bad Request ${num} not found`);

	res.send("updated successfully");
	
});

///Applied Tender 
router.get('/view-appliedtenders/:loginId',async(req,res)=>{
	//try{
		const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
       const applied=await SubmitedBid.find().where('bidderId').equals(bidder.bidderId)
       res.json(applied);
       
//	}catch(err){
	//	res.json({message:err});
	//}
});



//apply tender

router.post('/applyTender/:loginId',async (req,res)=>{
    
	const { error }   = validateTechnicalBid(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)
console.log(req.body)
	const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
	//const Quality=await qualityAssurance.findById({_id:bidder.quality})
  if(bidder){

let temp=new TechnicalBid({

	bidderId:bidder.bidderId,
	referenceNo:req.body.referenceNo,
	companyName:req.body.companyName,
	availabilityStatus:req.body.availabilityStatus,
	periodOfCompletion:req.body.periodOfCompletion,
	experienceInField:req.body.experienceInField,
	turnOver:req.body.turnOver,
	itemName:req.body.itemName,
	gradeOfMaterial:req.body.gradeOfMaterial,
   
	});
	
//console.log(req.body.experienceInField)
//console.log(req.body.turnOver)
	//const healthscore=((Quality.marks.Total + req.body.experienceInField + req.body.turnOver)*100) / 200;
//	temp.healthScore=healthscore;
		  

  temp.biddingStatus = "Pending" ;
  const data=temp.bidderId+temp.tenderId   
  const biddingId=uniqueid(7,data)
  temp.biddingId=biddingId
 


temp = await temp.save();
res.send("Sucessfully Applied Bid ")
} 
else{
res.send("bidder not found")
}

});

//View Submitted Bid
router.get('/appliedBid/:loginId',async(req,res)=>{
	try{
        const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
		const posts= await SubmitedBid.find().where('bidderId',bidder.bidderId);

		res.json(posts);

	}catch(err){
		res.json({message:err});
	}
});



// function to show submited bid -> biddingid and bidding status
// 
module.exports=router;