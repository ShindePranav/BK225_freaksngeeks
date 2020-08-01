const express=require('express')
const router=express.Router();
const Joi= require('joi')
const mongoose =require('mongoose');
const {uniqueId } = require( 'underscore' );
const {uniqueid}=require('../common/quick');
const {SubmitedBid,validatebidder}=require("../modules/bidding");
const {BidderRegistration}=require("../modules/bidder-registration")
const {qualityAssurance}=require("../modules/qualityassurance")

router.post('/:loginId',async (req,res)=>{
    
	    const { error }   = validatebidder(req.body)
        if(error) return res.status(400).send(`Bad Request ${error}`)

        const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
        const Quality=await qualityAssurance.findById({_id:bidder.quality})
        // Exception code here
      if(bidder){
//Formula to calulate the health score for bidder
//save the health score in Submited bid table/document
//const healthscore=(((bidder.quality.marks+req.body.experienceInField+req.body.turnOver)*100)/200);
//temp.healthscore=healthscore;
	let temp=new SubmitedBid({

        bidderId:bidder.bidderId,
        tenderId:req.body.tenderId,
        itemId:req.body.itemId,
        itemCost:req.body.itemCost,
        experienceInField:req.body.experienceInField,
        turnOver:req.body.turnOver,
        materialDescription:req.body.materialDescription,
        durationOfShipping:req.body.durationOfShipping,
        currencyType:req.body.currencyType,
       // rfq:Joi.string().required()
      //  biddingStatus:    
        });
console.log(req.body.experienceInField)
console.log(req.body.turnOver)
        const healthscore=((Quality.marks.Total + req.body.experienceInField + req.body.turnOver)*100) / 200;
        temp.healthScore=healthscore;
              
    //set bidding status
      temp.biddingStatus = "Pending" ;
      const data=temp.bidderId+temp.tenderId   
      const biddingId=uniqueid(7,data)
      temp.biddingId=biddingId
      bidder.bid
     


    temp = await temp.save();
    res.send("Sucessfully accpeted bidder ")
}
else{
    res.send("bidder not found")
}

});


router.get('/view-bid',async(req,res)=>{
	try{
        
		const posts= await SubmitedBid.find().where('biddingStatus','Pending');//using limit function after find will get limited database
		res.json(posts);

	}catch(err){
		res.json({message:err});
	}
});

router.post('/upload-rfq/:loginId', async(req,res)=>{
    try{
        
        const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
		const temp= await SubmitedBid.find({bidderId:bidder.bidderId});//using limit function after find will get limited database
     //   res.json(posts);
        if(req.files){
            // console.log(req.files)
             var file=req.files.file
             var filename=file.name
             console.log(filename)
             file.mv('../uploadAcceptedRFQ/'+filename,function(err){
                 if(err){
                     res.send(err)
                 }else{
                     const filepath=__dirname+'/uploadAcceptedRFQ/'+filename
               
                     //res.send("file uploaded"+filepath)
                     temp.rfq=filepath;
                     temp =temp.save();
                     res.send("Sucessfully uploaded ")
                     
                 }
             });
             
         }

	}catch(err){
		res.json({message:err});
	}
})

router.get('/download/:loginId',async(req, res) => {
  /*  var fileLocation  = req.params.rfq;
   // var fileLocation = path.join('./uploads',file);
    console.log(fileLocation);
    res.download(fileLocation);*/
    const bidder=await BidderRegistration.findOne({loginId:req.params.loginId})
        const temp= await SubmitedBid.find({bidderId:bidder.bidderId});
        var fileLocation=temp.rfq;
   // var fileLocation = path.join('./uploads',file);
    console.log(fileLocation);
    res.download(fileLocation);
    });
     

module.exports=router;