const express=require('express')
const router=express.Router();
const Joi= require('joi')
const mongoose =require('mongoose')
const _ =require('lodash')
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const {tenderDetailRegistration,validatetenderDetailRegistration}=require("../modules/tender-details");
const mailer=require("../common/mailer");
const moment=require('moment')
//const {issueTenderABI,issueTenderAddress}=require('../build/contracts/ABI');
const {issueTenderContract}=require('../build/contracts/ABI')
const { procurementManagerAddress}=require('../common/blockchainaccounts')

const Web3=require('web3')
//////BLOCKCHAIN
var web3 = new Web3("http://127.0.0.1:9545/");
var contract;
    web3 = new Web3(web3.currentProvider);
//Build Contract
//contract =  new web3.eth.Contract(issueTenderABI,issueTenderAddress);

router.post("/",async(req,res)=>{
    const {error}=validatetenderDetailRegistration(req.body);
    if(error) return res.status(400).send(`Bad Request ${error}`)

    let temp=tenderDetailRegistration({
        tenderId:req.body.tenderId,
		// activeBid:req.body.activeBid,
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
/*router.get('/view-activetender/:tenderId',async(req,res)=>{
	try{
       const posts=await tenderDetailRegistration.findOne({tenderId:req.params.tenderId})
       var datetime = new Date();
       console.log(datetime);
       if(posts.closingDate<=datetime){
         //  console.log(posts)
       res.json(posts);
       }
	}catch(err){
		res.json({message:err});
	}
});*/
router.get('/view-activetender',async(req,res)=>{
	try{
       const posts=await tenderDetailRegistration.find()
       var datetime = new Date();
       console.log(datetime);
       if(posts.closingDate<=datetime){
         //  console.log(posts)
       res.json(posts);
       }
	}catch(err){
		res.json({message:err});
	}
});

router.put('/updateStatus/:tenderId',async(req,res)=>{

    const tender=await tenderDetailRegistration.find({tenderId:req.params.tenderId})
    
    function updateStatusInContract(){ // only engineer

        var status=1;
          issueTenderContract.methods.updateStatus(status).then(function(res){
            console.log(res);
          })
          
        }

})

// Active Awareded Closed Retender




module.exports = router;