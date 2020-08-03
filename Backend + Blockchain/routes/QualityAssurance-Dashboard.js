const express=require('express')
const router=express.Router();
const {qualityAssurance,validatequalityassurance}=require("../modules/qualityassurance")
const {BidderRegistration}=require('../modules/bidder-registration')
const {qAContract}=require('../build/contracts/ABI')
const {qualityAssuranceAddress}=require('../common/blockchainaccounts')
const moment=require('moment')
const {SubmitedBid}=require("../modules/bidding")
const {gasPrice1,gas1}=require('../build/contracts/ABI');

const { toInteger, values } = require('lodash');


//replace login id in url with bidding id..........................................................
router.post('/:loginId',async (req,res)=>{
	const { error }   = validatequalityassurance(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)

	const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
	//const bid= await SubmitedBid.find().where('bidderId',bidder.bidderId);
	const bid= await SubmitedBid.find().where('bidderId',bidder.bidderId);
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
		   const atime=moment(temp.actualCompletionDate).unix();
		   const ctime=moment(temp.contractedDate).unix();
		   const date = new Date()
		   const d=moment(date).unix();
		   const value=toInteger(temp.price)

		   // Change---------------- fieldsn
		   // change type of string to number
		   // or write new BigNumber()
		   
		   //Right left exceution temp.orderId, 11,123,1233,"vendor1",123,2314,21,21,23
		   const res1 = await qAContract.methods.addQNA(temp.bidderId,1577232,
		   ctime,value,temp.nameOfSupplier,atime,atime,temp.marks.completionPerformance,temp.marks.qualityPerformance,temp.marks.reliabilityPerformance).send({from:qualityAssuranceAddress,gas:gas1,gasPrice:gasPrice1}).
			  then(function(res){
				console.log(res);  
				return res},function(e){
				console.log(e.message);
				return e});
				// const action=updateContract Status(tender.referenceNo,'1')
	     //console.log(res1)
		 res.send("successfully responded by quality assurance officer "+JSON.parse(JSON.stringify(res1)))
		 
});


router.get('/view-qualityAssurance',async(req,res)=>{
	//	try{
			
			async function getTenders(){
				const ans=await qAContract.methods.getAllQNAKeys().call().then(function(res){
					console.log(res);
					return res;
				})
				console.log(ans)
				return ans
			  }
			  const ans = await getTenders()
			  const array= Array()
			  for (var id in ans){
				const tender=await qAContract.methods.getBasicQNA(ans[id]).call().then(function(res){
					return res;
				})
	
				 array.push(tender)
			  }
			  res.send(array)
			
	
		//}catch(err){
		//	res.json({error:err});
		//}
	});

// Route for getting QNA details

// _----------------------------------------

/*
for single Quality Assurance Details
  const res1 = await qAContract.methods.getBasicQNA(temp.orderId).send({from:qualityAssuranceAddress,gas:gas1,gasPrice:gasPrice1}).
			  then(function(res){
				console.log(res);  
				return res},function(e){
				console.log(e.message);
				return e});


*/

module.exports = router;