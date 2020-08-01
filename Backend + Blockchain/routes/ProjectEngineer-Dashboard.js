
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
const {paymentLogContract}=require('../build/contracts/ABI');
const {projectEnggAddress}=require('../common/blockchainaccounts');
const BN = require('bn.js')
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

router.get('/view-bidder/',async(req,res)=>{
	try{
	   const posts=await BidderRegistration.find();
	   res.json(posts);
	}catch(err){
		res.json({message:err});
	}
});
router.get('/view-bidder/:loginId',async(req,res)=>{
	try{
	   const posts=await BidderRegistration.findOne({loginId:req.params.loginId});
	   res.json(posts);
	}catch(err){
		res.json({message:err});
	}
});
//router.post('/')
//function to award Bid

router.post('/awardTechnicalBid/:tenderId',async(req,res)=>{

	console.log("Inside Awarding Bid")
	const bidder=await BidderRegistration.findOne({loginId:req.body.loginId});
	
	await TechnicalBid.find().where('tenderId',req.params.tenderId).where('bidderId', bidder.bidderId).update({$set:{biddingStatus:'Technical'}});
	//const white=await SubmitedBid.find().where('tenderId',req.params.tenderId).where('bidderId', bidder.bidderId);
	res.send('Awarded Technical');

});

router.post('/awardBid/:tenderId',async(req,res)=>{

	console.log("Inside Awarding Bid")
	const bidder=await BidderRegistration.findOne({loginId:req.body.loginId});
	
	await SubmitedBid.find().where('tenderId',req.params.tenderId).where('bidderId', bidder.bidderId).update({$set:{biddingStatus:'Awarded'}});
	const white=await SubmitedBid.find().where('tenderId',req.params.tenderId).where('bidderId', bidder.bidderId);
	console.log(white[0].itemCost);
	var ans=white[0].itemCost
	console.log(typeof(ans))
	ans=ans.toString()
	console.log(ans)
	//const trans= await paymentTransaction(projectEnggAddress,bidder.accountAddress,ans);
	const trans= await sendMoney(projectEnggAddress,bidder.accountAddress);
	const firstInstalment=(Math.floor(white.itemCost /2)).toString()
	console.log(trans)
	if(true){
		paymentLogContract.methods.createPaymentEntryOne('1','11',projectEnggAddress,projectEnggAddress,'3' , '1')
		.send({from:projectEnggAddress}).then(function(res){console.log("Success")},
		(err)=>{console.log(err.message)})
	}else{
		console.log("Error in Transaction")
	}


    const grey=await SubmitedBid.find().where('tenderId',req.params.tenderId).ne('bidderId', bidder.bidderId);
	console.log(grey,white)
	await SubmitedBid.find().where('tenderId',req.params.tenderId).where('bidderId').ne(bidder.bidderId).update({$set:{biddingStatus:'Rejected'}});
	res.send('Awarded');

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
