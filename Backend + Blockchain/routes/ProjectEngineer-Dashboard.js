
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
const {TechnicalBid}=require('../modules/technical')
const mailer=require("../common/mailer");
const {paymentTransaction, sendMoney}=require('../common/quick')
const {paymentLogContract, gas1, gasPrice1,acceptBidContract}=require('../build/contracts/ABI');
const {projectEnggAddress}=require('../common/blockchainaccounts');
const {updateTenderStatus}=require('../common/quick')
//const mailer=require('../common/mailer')

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
router.get('/view-FinancialBid/',async (req,res)=>{
//try{

		async function getBid(){
			var bids=await acceptBidContract.methods.displayAllBids().call({from:projectEnggAddress}).then((s)=>{return s},(e)=>{return e})
			console.log(bids)
			return bids
		  }
		  const ans = await getBid()
		  const array= Array()
		  for (var id in ans){
			 
			const bid=await acceptBidContract.methods.displayFinancialBid(ans[id]).call({from:projectEnggAddress}).
			then(function(res){
				console.log(res)
				return res;
			},(e)=>{console.log(e.message)})
			console.log(array)
			array.push(bid)
			

             
		  }
		  res.send(array)

	//}catch(e){
	//	console.log("EROROROR")
	//}
	/*const bid=await acceptBidContract.methods.displayFinancialBid('suie777').call({from:projectEnggAddress}).
			then(function(res){
			
				return res;
			},(e)=>{return e.message})
			res.send(bid)*/

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

	//var bids=await acceptBidContract.methods.displayTechnicalBid(req.params.biddingId).call({from:projectEnggAddress}).then((s)=>{return s},(e)=>{return e})
	//console.log(bids);
    
	var bids=await acceptBidContract.methods.updateStatus(req.params.biddingId,'1').send({from:projectEnggAddress}).then((s)=>{return true},(e)=>{res.send(e.message)})
	if(bids){
		res.send(' Technical bid Accepted')
	}else{
		res.send('Bid not found')
	}
	
})

router.post('/awardFinancialBid/:key',async(req,res)=>{

	console.log("Inside Awarding Bid")

   const techBid=await  TechnicalBid.findOne().where('key',req.params.key)
	console.log(techBid)
	const Bidder=await  BidderRegistration.findOne().where('bidderId',techBid.bidderId)
	let msg=`Greeting You are Awarded.....!!!  First RTGS payment is initiated .
				
				Team FreaksNGeeks`

	let mailoptions={
		from:mailer.fromMail,
		to:Bidder.correspondenceEmail,
		subject:"Gail Tender",
		text:msg
	}

//send email
	mailsent=await mailer.transporter.sendMail(mailoptions,(error,response)=>{
		if(error){
			console.log(error);
		}
		console.log(response)
	});

	const bid=await acceptBidContract.methods.displayFinancialBid(req.params.biddingId).call({from:projectEnggAddress}).then(function(res){
		return res;
	})
	
	if(bid.key==techBid.key){
		var bids=await acceptBidContract.methods.updateStatus(req.params.biddingId,'3').call({from:projectEnggAddress}).then((s)=>{return true},(e)=>{res.send(e.message)})

	}
	var bids=await acceptBidContract.methods.updateStatus(req.params.biddingId,'1').call({from:projectEnggAddress}).then((s)=>{return true},(e)=>{res.send(e.message)})
	if(bids==true){
		const status= paymentLogContract.methods.createPaymentEntryOne('1','11',projectEnggAddress,projectEnggAddress,'3' , '1')
		.send({from:projectEnggAddress,gas:gas1,gasPrice:gasPrice1}).then(function(res){console.log(res);  return true;},
		(err)=>{console.log(err.message); return res.message;})

	}
	
	
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
