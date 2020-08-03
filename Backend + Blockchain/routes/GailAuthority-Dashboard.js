const express=require("express");
const bcrypt=require("bcrypt");
const _=require("lodash");
const router=express.Router();
const Joi= require('joi');
const mongoose =require('mongoose');
const {tenderDetailRegistration,validatetenderDetailRegistration,validateupdatetenderDetailRegistration}=require("../modules/tender-details");
const {GailOfficerRegistration,validateGailOfficerRegistration,validateUpdateGailOfficerRegistration}=require("../modules/gail-officer-regi");
//const { validateupdateBidderRegistration } = require("../modules/bidder-registration");
const moment = require('moment')
const {issueTenderContract, gas1, gasPrice1}=require('../build/contracts/ABI')
const {procurementManagerAddress}=require('../common/blockchainaccounts')
//Issue Tender
//const {issueTenderABI,issueTenderAddress}=require('../build/contracts/ABI')
const Web3=require('web3')
//////BLOCKCHAIN
var web3 = new Web3("http://127.0.0.1:9545/");
var contract;
    web3 = new Web3(web3.currentProvider);
//Build Contract
//contract =  new web3.eth.Contract(issueTenderABI,issueTenderAddress);
router.post("/issueTender",async(req,res)=>{
    const {error}=validatetenderDetailRegistration(req.body);
    if(error) return res.status(400).send(`Bad Request ${error}`)

    let temp=tenderDetailRegistration({
        tenderId:req.body.tenderId,
		activeBid:req.body.activeBid,
		tenderTitle:req.body.tenderTitle,
        referenceNo:req.body.referenceNo,
		closingDate:req.body.closingDate,
        bidOpeningDate:req.body.bidOpeningDate,
      //  tenderStatus:req.body.tenderStatus,
		tenderType:req.body.tenderType,
        tenderLocation:req.body.tenderLocation,
        itemId:req.body.itemId,
        unit:req.body.unit,
        product:req.body.product,
        quantity:req.body.quantity,
        productCategory:req.body. productCategory,
        description:req.body. description,
        productId:req.body. productId,
        itemType:req.body.itemType,
        currencyType:req.body.currencyType

    });
  temp.tenderStatus="Active";
    /*msg=`successfully registered tender-details here is your tenderId:${temp.tenderId} `
    let mailoptions={
        from:mailer.fromMail,
        to:temp.Co,
        subject:"tender-details",
        text:msg
    }
    mailer.transporter.sendMail(mailoptions,(error,response)=>{
        if(error){
            console.log(error);
        }
        console.log(response)
    });*/
    console.log(temp)
    //////BLOCKCHAIN
    async function createTender(){
       // var tenNumber=7;
       // var stri1="hrfhb";
       refno=parseInt(temp.referenceNo)
       bidOpen=moment(temp.bidOpeningDate).unix();
       closeDate=moment(temp.closingDate).unix();
      
        const result = issueTenderContract.methods.createTender(refno,temp.tenderTitle,temp.tenderType,temp.productCategory,bidOpen,closeDate)
        .send({from:procurementManagerAddress,gas:300000}).then(function(res){
          
       
          temp = temp.save();
        console.log("Succesfully Created Record in Blockchain"+res);
        //console.log("Result inside contract"+res)
         return res;
          
        },function(error){
            console.log("Error"+error);
            return error['data'];
        })
       // console.log("Result inside function"+JSON.parse(JSON.stringify(result)))
        return result
      }
     const ans = await createTender();
         
    res.send(ans)

    /* web3.eth.subscribe('TenderCreated', function(error, result){
        if (!error){
           // res.send(error)
           console.log(error)
        }
        //res.send("Success")
    })
    .on("data", function(transaction){
        console.log(transaction);
    });*/
    ////END BLOCKCHAIN
//Save Data on backend
//temp = await temp.save();
//res.send("successfully Registered for tender-details ")

});















// All Tender
router.get("/view-tender",async(req,res)=>{
    try{
const posts= await tenderDetailRegistration.find();
res.json(posts)
    }catch(err){
res.json({message:err});
    }
});

router.put('/edit-tender/:tenderId',async(req,res)=>{
const {error}=validateupdatetenderDetailRegistration(req.body);
if(error) return res.status(400).send(`Bad Request ${error}`)
const temp= await tenderDetailRegistration.findOneAndUpdate({tenderId:req.params.tenderId},
	{$set:req.body},{new:true});

         if(!temp) return res.status(400).send(`bad Request ${num} not found`);

	      res.send("updated successfully");

});
router.put('/edit-profile/:loginId',async (req,res)=>{
	const { error }= validateUpdateGailOfficerRegistration(req.body)
	if(error) return res.status(400).send(`Bad Request ${error}`)

	const temp=await GailOfficerRegistration.findOneAndUpdate({loginId:req.params.loginId},
		{$set:req.body},{new:true});


	if(!temp) return res.status(400).send(`bad Request ${num} not found`);

	res.send("updated successfully");
	
});
router.get('/view-profile/:loginId',async(req,res)=>{
	try{
	   const posts=await GailOfficerRegistration.findOne({loginId:req.params.loginId});
	   res.json(posts);
	}catch(err){
		res.json({message:err});
	}
});



router.get('/view-tender/:tenderId',async(req,res)=>{
	try{
	   const posts=await tenderDetailRegistration.findOne({tenderId:req.params.tenderId});
	   res.json(posts);
	}catch(err){
		res.json({message:err});
	}
});

router.get('/view-activetender', async(req,res)=>{
	try{
		var datetime = new Date();
       const posts=await tenderDetailRegistration.find().where('closingDate').lt(datetime)
	   
       res.json(posts);

	}catch(err){
		res.json({message:err});
	}
});


router.get('/view-tenders',async(req,res)=>{
//	try{
		
		async function getTenders(){
			const ans=await issueTenderContract.methods.viewTenders().call().then(function(res){
				console.log(res);
				return res;
			})
			console.log(ans)
			return ans
		  }
		  const ans = await getTenders()
		  const array= Array()
		  for (var id in ans){
			const tender=await issueTenderContract.methods.viewTender(ans[id]).call().then(function(res){
				return res;
			})

             array.push(tender)
		  }
		  res.send(array)
		

	//}catch(err){
	//	res.json({error:err});
	//}
});/*
router.get('/view-tenders/:tenderId',async(req,res)=>{
	try{
	  // const posts=await tenderDetailRegistration.findOne({tenderId:req.params.tenderId});
	   //res.json(posts);
	   //BlockChain
		async function getTender(){
			const ans=await contract.methods.viewTender(req.params.tenderId).call().then(function(res){
				return res;

			  //document.getElementById('tenderDetails').innerHTML = res[0]+"    "+res[1]+"    "+res[2]+"    "+res[3]+"    "+res[4];
			})
			//console.log(ans)
			return ans
			
		  }
		  const ans = await getTender()
	      

		  res.json(ans)
	}catch(err){
		res.json({message:err});
	}
});
*/


module.exports = router;
