const express=require('express')
const router=express.Router();
const {GailShippingAuthority,OwnShippingAuthority,validateshippingservices}=require("../modules/shippingservicesauthority")
const mailer=require("../common/mailer");
const {BidderRegistration,}=require("../modules/bidder-registration")
const constant = require('../common/appLevelConstant')
const {sortArray}=require('../common/quick');
const { request } = require('express');
const {shipmentContract}=require('../build/contracts/ABI');
const {owner,midpoint,destination}=require('../common/blockchainaccounts')

const Web3=require('web3')
var web3 = new Web3("http://127.0.0.1:9545/");
web3 = new Web3(web3.currentProvider);



router.post('/:loginId', async function(req,res) {

    var ques = req.body.type;
    const bidder= await BidderRegistration.findOne({ loginId: req.params.loginId })
	
	if((ques).localeCompare(constant.GAIL)==0){
        var postal=new Array();
        GailShippingAuthority.find(null, {"_id":false,"postalCode": true }, function (err, data) {
            if(err) { return handleError(res, err); }      
             for(var i=0;i<data.length;i++){
            postal.push(data[i].postalCode)
        }
//console.log(bidder.postalCode)
//console.log(postal)
        const arr=sortArray(bidder.postalCode,postal)
       
    async function Solved() {

     const final = await GailShippingAuthority.findOne({postalCode:arr[0]});

     //mail details of final to bidder mail id
     console.log(final.contactpersonemailId)
     if(final){

        msg=`successfully confirmed Gail shipping authority Below are shipphing details:companyname: ${req.body.companyName }`//${link}
        let mailoptions={
        from:mailer.fromMail,
         to: final.contactPersonEmailId,
        subject:"gailshipping authority confirmed",
        text:msg
              }
  
  //send email
        mailer.transporter.sendMail(mailoptions,(error,response)=>{
         if(error){
          console.log(error);
          }
          console.log(response)
         }); 
  
         res.send("successfully gailshipping authority confirmed")
     }else{
         res.send(" gailshipping authority not confirmed")
        
        }} Solved();

         

    })}
    else{
        console.log("we are in else part ")
        
           
         let temp=new OwnShippingAuthority({

            companyName:req.body.companyname,
      containerID:req.body.containerId,
itemId:req.body.itemId,
orderRefNumber:req.body.OrderRefNumber,
contactPersonName:req.body.contactpersonname,
contactPersonMobNo:req.body.contactPersonMobNo,
contactPersonEmailId:req.body.contactpersonemailId,
postalCode:req.body.postalcode
         })
 //setconditions(string memory _location,uint _quantity,address _receiverAddess,string memory _asset)
        const ship=await shipmentContract.methods.setconditions(temp.postalCode,temp.itemId,destination,"Steel Pipe")
         .send({from:owner}).then((s)=>{return s},(e)=>{return e})
         console.log(ship)

         // mail corfirming the shipping
             msg=`successfully registered project engineer here is your data:${temp.contactPersonEmailId} 
             ${temp.companyName} ${temp.containerID} ${temp.itemId} ${temp.orderRefNumber} 
             ${temp.contactPersonName} ${temp.postalCode}  `//${link}
            let mailoptions={
             from:mailer.fromMail,
             to:req.body.contactpersonemailId,
             subject:"ownshpping authority confirmed",
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
             res.send("Success: Own shipping authority confirmed")
           }

});


router.post("/",async(req,res)=>{
    const {error}=validateshippingservices(req.body);
    if(error) return res.status(400).send(`Bad Request ${error}`)

    let temp=new GailShippingAuthority({

        companyName:req.body.companyName,
  containerID:req.body.containerID,
itemId:req.body.itemId,
orderRefNumber:req.body.orderRefNumber,
contactPersonName:req.body.contactPersonName,
contactPersonMobNo:req.body.contactPersonMobNo,
contactPersonEmailId:req.body.contactPersonEmailId,
postalCode:req.body.postalCode
     })
   
    
//Save Data on backend
temp = await temp.save();
res.send("successfully Registered Gail Shipping Authority ")

});
//sendShipment(string memory _asset,string memory trackingNo, string memory _destination,uint _quantity,address _reciever)
router.post('/shipnext/:loginId',async (req,res)=>{
    const ship=await shipmentContract.methods.sendShipment("Steel Pipe","1234","postalCode","100",destination)
         .send({from:midpoint,gas:300000}).then((s)=>{return s},(e)=>{return e})
         console.log(ship)
})

//getshipment(string memory _location,uint _quantity,string memory _asset,string memory trackingNo)
router.post('/receivedShipment/:loginId', async (req,res)=>{

    const receive=await shipmentContract.methods.getshipment("postalCode","100","Steel Pipe","1234")
         .send({from:destination,gas:300000}).then((s)=>{return s},(e)=>{return e})
         console.log(receive)

})
router.post('/forwardShipment/:loginId', async (req,res)=>{

    const receive=await shipmentContract.methods.getshipment("postalCode","100","Steel Pipe","1234")
         .send({from:midpoint,gas:300000}).then((s)=>{return s},(e)=>{return e})
         console.log(receive)

})
//showProvenance(string memory _trackingNo)
router.post('/history/:loginid',async (req,res)=>{
    const hist=await shipmentContract.methods.showProvenance("1234")
         .send({from:midpoint,gas:300000}).then((s)=>{return s},(e)=>{return e})
         console.log(hist)
         res.send(hist);

})
    
   
module.exports = router;