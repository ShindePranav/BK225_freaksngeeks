
const express=require('express')
const router=express.Router();
const Joi= require('joi')
const mongoose =require('mongoose')
const _ =require('lodash')
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
//const dot = require('dot-object');
//REquire
const {GailOfficerRegistration,validateGailOfficerRegistration,validateUpdateGailOfficerRegistration}=require("../modules/gail-officer-regi");
const {BidderRegistration,validateBidderRegistration} = require('../modules/bidder-registration')
const {SubmitedBid}=require('../modules/bidding')
const mailer=require("../common/mailer");
const {paymentTransaction, sendMoney}=require('../common/quick')
const {paymentLogContract, gas1, gasPrice1,acceptBidContract}=require('../build/contracts/ABI');
const {projectEnggAddress}=require('../common/blockchainaccounts');
const {updateTenderStatus}=require('../common/quick')

const BN = require('bn.js');
const { tenderDetailRegistration } = require('../modules/tender-details');

router.get('/view-TechnicalBid/:biddingId',async (req,res)=>{
try{
  
	var bids=await acceptBidContract.methods.displayTechnicalBid(req.params.biddingId).call({from:projectEnggAddress}).then((s)=>{return s},(e)=>{return e})
	console.log(bids);
	res.send(bids)
}catch(e){
	console.log("EROROROR")
}});
router.get('/view-TechnicalBid/',async (req,res)=>{
	try{
	  
		async function getBid(){
			var bids=await acceptBidContract.methods.displayAllBids().call({from:projectEnggAddress}).then((s)=>{return s},(e)=>{return e})
			console.log(bids)
			return bids
		  }
		  const ans = await getBid()
		  const array= Array()
		  for (var id in ans){
			const bid=await acceptBidContract.methods.displayTechnicalBid(ans[id]).call({from:projectEnggAddress}).then(function(res){
				return res;
			})

             array.push(bid)
		  }
		  res.send(array)
	}catch(e){
		console.log("EROROROR")
	}

})



router.get('/view-profile/:loginId',async(req,res)=>{
	try{
	   const posts=await GailOfficerRegistration.findOne({loginId:req.params.loginId});
	   posts.password="000";
	   res.json(posts);
	}catch(err){
		res.json({message:err});
	}
});


router.put('/edit-profile/:loginId',async (req,res)=>{
	const { error }   = validateUpdateGailOfficerRegistration(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)
	
	
	const temp=await GailOfficerRegistration.findOneAndUpdate({loginId:req.params.loginId},
		{ $set: req.body }, { new: true });

	if(!temp) return res.status(400).send(`bad Request ${num} not found`);

	res.send("updated successfully");
});


router.get('/view-bidder/:loginId',async(req,res)=>{
	try{
	   const posts=await BidderRegistration.findOne({loginId:req.params.loginId});
	   res.json(posts);
	}catch(err){
		res.json({message:err});
	}
});
router.get('/view-bidder',async(req,res)=>{
	try{
	   const posts=await BidderRegistration.find();
	   res.json(posts);
	}catch(err){
		res.json({message:err});
	}
});
//router.post('/')
//function to award Bid

router.post('/awardTechnicalBid/:biddingId',async(req,res)=>{

	console.log("Inside Awarding Bid")
	/*/const bidder=await BidderRegistration.findOne({'bidderId':req.body.bidderId});
	const tender=await tenderDetailRegistration.findOne({'tenderId':req.body.tenderId});
	
	await SubmitedBid.find().where('tenderId',req.body.tenderId).where('bidderId', req.body.bidderId).update({$set:{biddingStatus:'Awarded'}});
	const white=await SubmitedBid.find().where('tenderId',req.body.tenderId).where('bidderId', req.body.bidderId);
	*/
	
	//const trans= await paymentTransaction(projectEnggAddress,bidder.accountAddress,ans);
	//const trans= await sendMoney(projectEnggAddress,bidder.accountAddress);
	const firstInstalment=(Math.floor(white.itemCost /2)).toString()
	//console.log(trans)
	
	const status= paymentLogContract.methods.createPaymentEntryOne('1','11',projectEnggAddress,projectEnggAddress,'3' , '1')
		.send({from:projectEnggAddress,gas:gas1,gasPrice:gasPrice1}).then(function(res){console.log(res);  return true;},
		(err)=>{console.log(err.message); return res.message;})
		
	
//	const action= await updateTenderStatus(tender.referenceNo,'1')
	//console.log(action)
	// console.log(action)


    const grey=await SubmitedBid.find().where('tenderId',req.params.tenderId).ne('bidderId', bidder.bidderId);
	console.log(grey,white)
	await SubmitedBid.find().where('tenderId',req.params.tenderId).where('bidderId').ne(bidder.bidderId).update({$set:{biddingStatus:'Rejected'}});
	
	if(status){
		console.log("Payment One Completed");
		res.send('Awarded');
	}else{
		console.log(status);
		res.send(status);
	}
})


router.get('/view-awardedbid',async(req,res)=>{
	
        console.log("inside view bid")
		const posts= await SubmitedBid.find().where('biddingStatus','Rejected');//using limit function after find will get limited database
		console.log(posts)
		res.json(posts);

	
});
router.get('/view-pendingbid',async(req,res)=>{
	
	console.log("inside view bid")
	const posts= await SubmitedBid.find().where('biddingStatus','Pending');//using limit function after find will get limited database
	console.log(posts)
	res.json(posts);


});

module.exports = router;
