const express=require('express')
const router=express.Router();
const Joi= require('joi')
const mongoose =require('mongoose')
//const {Genres}=require('../modules/genrem')
const {BidderRegistration,validateBidderRegistration} = require('../modules/bidder-registration')
const mailer = require('../common/mailer')
const nodemailer=require ('nodemailer');
const bcrypt=require('bcrypt');
const {uniqueid,createNewAccount,getAccountBalance,sendMoney}=require("../common/quick")
const {account}=require('../common/blockchainaccounts')



router.post('/',async (req,res)=>{
	const { error }   = validateBidderRegistration(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)

	//const genre = await Genres.findById(req.body.genreId)
	//if(!genre) return res.status(400).send('Wrong Genre Id')

	const salt =await bcrypt.genSalt(10)
	const hashedPassword=await bcrypt.hash(req.body.password,salt)
	

	let temp=new BidderRegistration({

		
		loginId:req.body.loginId,
		password:hashedPassword,
	    correspondenceEmail:req.body.correspondenceEmail,
        mobileNumber:req.body.mobileNumber,
        companyName:req.body.companyName,
        preferentialBidder:req.body.preferentialBidder,
        registrationNumber:req.body.registrationNumber,
        registeredAddress:req.body.registeredAddress,
        nameOfPartners:req.body.NameOfPartners,
        bidderType:req.body.bidderType,
        city:req.body.city,
        state:req.body.state,
        postalCode:req.body.postalCode,
		panTanNumber:req.body.panTanNumber,
		establishmentYear:req.body.establishmentYear,
		natureOfBusiness:req.body.natureOfBusiness,
		legalStatus:req.body.legalStatus,
		companyCategory:req.body.companyCategory,
		title:req.body.title,
		contactName:req.body.contactName,
		dateOfBirth:req.body.dateOfBirth,
		designation:req.body.designation,
		phoneNumber:req.body.phoneNumber

			});
			const data=temp.correspondenceEmail+temp.phoneNumber;
			const bidderId=uniqueid(10,data)
			temp.bidderId=bidderId
			const add= createNewAccount();
			temp.accountAddress=add;
			await sendMoney(account[9],add)
			const bal= await getAccountBalance(add);
			temp.accountBalance=bal;
	//email options
	let msg=`YOur have Registerred succesfully.  Here Are your details 
				Login id :${temp.loginId} Password: ${req.body.password} Bidding COmpany Id: ${bidderId}`

	let mailoptions={
		from:mailer.fromMail,
		to:temp.correspondenceEmail,
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
	


	temp = await temp.save();
	res.send("Succefully Registered as bidder")

});

module.exports=router;