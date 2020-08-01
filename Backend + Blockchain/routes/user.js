const express=require('express')
const router=express.Router();
const Joi= require('joi')
const mongoose =require('mongoose')
const _ =require('lodash')
const bcrypt=require('bcrypt');
//REquire
const {User,validateUser}=require("../modules/users");
const {BidderRegistration,validateBidderRegistration}=require('../modules/bidder-registration')
const {GailOfficerRegistration,validateGailOfficerRegistration}=require('../modules/gail-officer-regi')
const {login}=require("../common/authServer")
//Authetication
const request =require('request')
const constant = require('../common/appLevelConstant')


//Login into system
router.post('/login',async (req,res)=>{

	const { error }   = validateUser(req.body)
	if(error) return res.status(400).send(`Very Bad Request ${error}`)
	
	var ques=JSON.parse(JSON.stringify(req.body.authority))
	
	//res.send(ans)
	//let user= await User.findOne({loginId:req.body.loginId})
	if((ques).localeCompare(constant.BIDDER)==0){

		let user= await BidderRegistration.findOne({loginId:req.body.loginId})

		if(user){

		bcrypt.compare(req.body.password, user.password, function (err, result){
			if (result == true) {

				var body={"loginId":user.loginId}
				const token=login(user.loginId)
				res.send(token)

/*
				const options = {
					url: 'http://127.0.0.1:4000/login/',
					method: "POST",
					json:true,
					body:{
						"loginId":user.loginId
					}
				  };
				   
				  function callback(error, response, body) {
					if (!error && response.statusCode == 200) {
					  const info = JSON.parse(JSON.stringify(body));
					  res.json(info)
					}
				  }
				   
				  request(options, callback);
				//res.send({"message":'Congratulations You Are In...!!!!!'}).status(200);*/
				
			} else {
			 res.send('Incorrect password').status(400);
			 //res.redirect('/');
			}

		//res.send('Please Check the Authority').status(400);

		})}else{
			res.send("Error Bidder Not Found")
		}
	} 
	else
	{

		
		let user= await GailOfficerRegistration.findOne({loginId:req.body.loginId})
		if(!user){
			res.send("Error Gail officer not found please register!!")
		}
		else{
		bcrypt.compare(req.body.password, user.password, function (err, result){
			if (result == true) {

				const token=login(user.loginId)
				res.send(token)

			/*
				const options = {
					url: 'http://127.0.0.1:4000/login/',
					method: "POST",
					json:true,
					body:{
						"loginId":user.loginId
					}
					
					
					
				  };
				   //
				  function callback(error, response, body) {
					if (!error && response.statusCode == 200) {
					  const info = JSON.parse(JSON.stringify(body));
					  res.json(info)
					}
				  }
				   
				request(options, callback);*/
		  
				}else {
					res.send('Incorrect password').status(400);
					//res.redirect('/');
				   }
			})
		}}


});

module.exports = router ;