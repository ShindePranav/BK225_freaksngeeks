const mongoose=require('mongoose')
const Joi= require('joi');
const number = require( 'joi/lib/types/number' );


const TechnicalBid = mongoose.model('TechnicalBid',new mongoose.Schema({
 
companyName:{
	type:String,
		required:true
 },
//tenderId:{
  //  type:String,
  //  required:true
//},
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
    type:String, ///Level Wise Accepeted , Desk1, Desk 2 , Rejected
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


    date:Date
    

}))


function validateTechnicalBid(obj){
	const schema={
       //bidderId:Joi.string().required(),
       companyName:Joi.string().required(),
      tenderId:Joi.string().required(),
       availabilityStatus:Joi.number().required(),
       periodOfCompletion:Joi.string().required(),
       experienceInField:Joi.string().required(),
       turnOver:Joi.string().required(),
       itemName:Joi.string().required(),
       gradeOfMaterial:Joi.string().required(),
       // rfq:Joi.string().required(),
        //biddingStatus:Joi.string().required()
        
	}	
	
	return Joi.validate(obj ,schema);

}

exports.TechnicalBid=TechnicalBid;
exports.validateTechnicalBid=validateTechnicalBid;