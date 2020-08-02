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
const {issueTenderABI,issueTenderAddress}=require('../common/ABI');

const Web3=require('web3')
//////BLOCKCHAIN
var web3 = new Web3("http://127.0.0.1:9545/");
var contract;
    web3 = new Web3(web3.currentProvider);
//Build Contract
contract =  new web3.eth.Contract(issueTenderABI,issueTenderAddress);

router.post("/",async(req,res)=>{
    const {error}=validatetenderDetailRegistration(req.body);
    if(error) return res.status(400).send(`Bad Request ${error}`)

    let temp=tenderDetailRegistration({
        tenderId:req.body.tenderId,
		activeBid:req.body.activeBid,
		tenderTitle:req.body.tenderTitle,
        referenceNo:req.body.referenceNo,
		closingDate:req.body.closingDate,
        bidOpeningDate:req.body.bidOpeningDate,
        tenderStatus:req.body.tenderStatus,
		tenderType:req.body.tenderType,
        //authority:req.body.authority,
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
    function createTender(){
       // var tenNumber=7;
       // var stri1="hrfhb";
       refno=parseInt(temp.referenceNo)
       bidOpen=moment(temp.bidOpeningDate).unix();
       closeDate=moment(temp.closingDate).unix();
       
        contract.methods.createTender(refno,temp.tenderTitle,temp.tenderType,temp.productCategory,bidOpen,closeDate)
        .send({from:"0xc9A3753745CD9C8e9e8cCd5F95dAcd2E8C4ce734",gas:300000}).then(function(res){
          console.log(res);
          

          //console.log("Succesfully Created Record in Blockchain");
          temp =  temp.save();
          
        })
        
    
      }
      createTender();
      res.send("Success")
   /* var subscription = web3.eth.subscribe('TenderCreated', function(error, result){
        if (!error)
            console.log(result);
    })
    .on("data", function(transaction){
        console.log(transaction);
    });*/
    ////END BLOCKCHAIN
//Save Data on backend
//temp = await temp.save();
//res.send("successfully Registered for tender-details ")

});

module.exports = router;