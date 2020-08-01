const express=require('express')
const router=express.Router();
const Joi= require('joi')
const mongoose =require('mongoose')
const _ =require('lodash')
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
//REquire
const {GailOfficerRegistration,validateGailOfficerRegistration}=require("../modules/gail-officer-regi");
const mailer=require("../common/mailer");

router.post('/',async (req,res)=>{
	const { error }   = validateGailOfficerRegistration(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)

	//const genre = await Genres.findById(req.body.genreId)
    //if(!genre) return res.status(400).send('Wrong Genre Id')
    const salt =await bcrypt.genSalt(10)
	const hashedpassword=await bcrypt.hash(req.body.password,salt)
	
	let temp=new GailOfficerRegistration({
        loginId:req.body.loginId,
		password:hashedpassword,
		authority:req.body.authority,
        emailId:req.body.emailId,
        employeeId:req.body.employeeId,
		phoneNumber:req.body.phoneNumber
			});
msg=`successfully registered gail officer  here is your emailId:${temp.emailId} password:${req.body.password}`
			let mailoptions={
				from:mailer.fromMail,
				to:temp.emailId,
				subject:"gail officer registeration",
				text:msg
			}
			
			//send email
			mailer.transporter.sendMail(mailoptions,(error,response)=>{
				if(error){
					console.log(error);
				}
				console.log(response)
			});
			

	temp = await temp.save();
	res.send("successfully Registered Gail officer ")

});
module.exports=router;

