const mongoose=require('mongoose')
const Joi= require('joi');
const number = require( 'joi/lib/types/number' );


const TechnicalBid = mongoose.model('TechnicalBid',new mongoose.Schema({
 
companyName:{
	type:String,
		required:true
 },
referenceNo:{
    type:Number,
   required:true
},
availabilityStatus:{
    type:String,
    required:true
},
periodOfCompletion:{
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
itemName:{
    type:String,
    required:true
},
biddingStatus:{
    type:String, ///0,1,2,3--->submitted, techincal , rejected awarded
    default:"Not Submitted"

},
gradeOfMaterial:{
    type:String,
    default:"Not Submitted"
}
,
biddingId:{
    type:String,
    default:"00"
},
bidderId:{
    type:String
},
amount:{
    type:Number,
   // require:true
},
keyStatus:{
    type:Boolean,
    //required:true
    default:false
}
,
key:{
    type:String
},

biddingDate:Date
    

}))


function validateTechnicalBid(obj){
	const schema={
       //bidderId:Joi.string().required(),
       companyName:Joi.string().required(),
      referenceNo:Joi.string().required(),
       availabilityStatus:Joi.number().required(),
       periodOfCompletion:Joi.string().required(),
       experienceInField:Joi.string().required(),
       turnOver:Joi.string().required(),
       itemName:Joi.string().required(),
       gradeOfMaterial:Joi.string().required(),
       amount:Joi.number().required()
       // rfq:Joi.string().required(),
        //biddingStatus:Joi.string().required()
        
	}	
	
	return Joi.validate(obj ,schema);

}

exports.TechnicalBid=TechnicalBid;
exports.validateTechnicalBid=validateTechnicalBid;