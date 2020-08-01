const express=require('express')
const router=express.Router();
const {qualityAssurance,validatequalityassurance}=require("../modules/qualityassurance")
const {BidderRegistration}=require('../modules/bidder-registration')




router.post('/:loginId',async (req,res)=>{
	const { error }   = validatequalityassurance(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)

	const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
	//add exception

	let temp=new qualityAssurance({
		bidderId:bidder.bidderId,
        companyName:req.body.companyName,
        orderId:req.body.orderId,
		description:req.body.description,
        price:req.body.price,
        nameOfSupplier:req.body.nameOfSupplier,
        actualCompletionDate:req.body.actualCompletionDate,
		contractedDate:req.body.contractedDate,
		marks:req.body.marks,
		note:req.body.note,
		performanceRating:req.body.performanceRating,
		nameofAuthorizedPerson:req.body.nameofAuthorizedPerson,
		designationofAuthorizedPerson:req.body.designationofAuthorizedPerson
		   });
		

	temp = await temp.save();
	res.send("successfully responded by quality assurance officer ")

});
module.exports = router;
