const express=require('express')
const router=express.Router();
const {qualityAssurance,validatequalityassurance}=require("../modules/qualityassurance")
const {BidderRegistration}=require('../modules/bidder-registration')
const {qAContract}=require('../build/contracts/ABI')
const {qualityAssuranceAddress}=require('../common/blockchainaccounts')
const moment=require('moment')
const {SubmitedBid}=require("../modules/bidding")



router.post('/:loginId',async (req,res)=>{
	const { error }   = validatequalityassurance(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)

	const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
	//const bid= await SubmitedBid.find().where('bidderId',bidder.bidderId);
	//add exception
	//find date of

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
		nameOfAuthorizedPerson:req.body.nameOfAuthorizedPerson,
		designationOfAuthorizedPerson:req.body.designationOfAuthorizedPerson
		   });
		   temp = await temp.save();
		   bidder.quality=temp._id
		   bidder.save()
		   console.log(temp._id)
		   const ctime=2314546;///moment(temp.actualCompletionDate).unix();
		   const date = new Date()
		   const d=321456789///moment(date).unix();

		   // Change---------------- fieldsn
		   // change type of string to number
		   // or write new BigNumber()
		   const res1 = await qAContract.methods.addQNA(temp.orderId, 11,
		   123,1233,"vendor1",123,2314,21,21,23).send({from:qualityAssuranceAddress,gas: 300000,
				gasPrice: 100000000000}).
			  then(function(res){
				console.log(res);  
				return res},function(e){
				console.log(e.message);
				return e});
	     //console.log(res1)
		 res.send("successfully responded by quality assurance officer "+JSON.parse(JSON.stringify(res1)))
		 
});
module.exports = router;