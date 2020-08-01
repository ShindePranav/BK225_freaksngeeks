const mongoose=require('mongoose')
const Joi= require('joi');
const number = require( 'joi/lib/types/number' );
//var autoIncrement = require('mongoose-auto-increment');

const SubmitedBid = mongoose.model('bidder',new mongoose.Schema({
 
    bidderId:{
	type:String,
		required:true
 },
tenderId:{
    type:String,
    required:true
},
itemId:{
    type:String,
    required:true
},
itemCost:{
    type:Number,
    required:true
},
experienceInField:{
    type:String,
    required:true
},
turnOver:{
    type:String,
    required:true
},
materialDescription:{
    type:String,
    required:true
},
durationOfShipping:{
    type:String,
    required:true
},
biddingStatus:{
    type:String, ///Level Wise Accepeted , Desk1, Desk 2 , Rejected
    default:"Not Submitted"

},
currencyType:{
    type:String // Dropdown Dollar, INR, EURO etc
},
rfq:{
    type:String // Provide Link to download RFQ submited 
},
biddingId:{
    type:String,
    default:"00"//then generate bs
},
healthScore:{
    type:String // Calculate and store bidder health score every time bidder bid
},


//Auto Generate Bid Id and Email it to Bidder also Show on UI in Applied Tenders

    date:Date
    

}))
/*autoIncrement.initialize(mongoose.connection); // 3. initialize autoIncrement 

Bidder.plugin(autoIncrement.plugin, 'BidId'); // 4. use autoIncrement
mongoose.model('BidId', Bidder);*/

function validatebidder(obj){
	const schema={
       // bidderId:Joi.string().required(),
        tenderId:Joi.string().required(),
        itemId:Joi.string().required(),
        itemCost:Joi.number().required(),
        experienceInField:Joi.string().required(),
        turnOver:Joi.string().required(),
        materialDescription:Joi.string().required(),
        durationOfShipping:Joi.string().required(),
        currencyType:Joi.string().required(),
       // rfq:Joi.string().required(),
        //biddingStatus:Joi.string().required()
        
	}	
	
	return Joi.validate(obj ,schema);

}

exports.SubmitedBid=SubmitedBid;
exports.validatebidder=validatebidder;