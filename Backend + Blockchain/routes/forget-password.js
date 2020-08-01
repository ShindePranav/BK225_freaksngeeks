const express=require('express')
const {otpVerify,genOtp} = require("../common/otp")
const router = express.Router();
const mailer=require('../common/mailer')

router.post('/',async (req,res)=>{
       
    token = genOtp()
    console.log(token)
    msg=`Your Otp is ${token}. PLease Dont share your Otp to anyone.`
    let mailoptions={
		from:mailer.fromMail,
		to:req.body.emailId,
		subject:"Otp Verification",
		text:msg
	}

//send email
	mailer.transporter.sendMail(mailoptions,(error,response)=>{
		if(error){
			console.log(error);
		}
		console.log(response)
    });
    
    res.send("otp generated")


})

router.post('/verify',async (req,res)=>{
    
    otp=JSON.parse(req.body)
    
    let ans=otpVerify(otp.otp)
    if(ans){
        res.send("Success")
    }
    res.send("Sorry")

})

module.exports=router



