const Joi= require('joi')
const mongoose=require('mongoose'); 
//const string = require( 'joi/lib/types/number' );

const qualityAssurance=mongoose.model('qualityAssurance',new mongoose.Schema({
    companyName:{
        type:String,
		required:true
    },
    orderId:{
        type:Number,
		required:true
    },
    description:{
        type:String,
		required:true
    },
    price:{
        type:Number,
		required:true
    },
    nameOfSupplier:{
        type:String,
		required:true
    },
    actualCompletionDate:{
        type:Date,
		required:true
    },
	contractedDate:{
        type:Date,
		required:true
    },
    marks:{
        completionPerformance:{
            type:Number,
            required:true
        },
        qualityPerformance:{
            type:Number,
            required:true
        },
        reliabilityPerformance:{
            type:Number,
            required:true
        },
        Total:{
            type:Number,
            required:true
        }
        
    },
     note:{
        type:String,
		required:true
     },
    performanceRating:{
        type:Number,
		required:true
    },
    nameOfAuthorizedPerson:{
        type:String,
		required:true
    },
    designationOfAuthorizedPerson:{
        type:String,
		required:true
    },
    bidderId:{
        type:String
    },
    //contract id in blockchain
    biddingId:{
        type:String,
        default:"00"//then generate bs
    },
    tenderId:{
		type:String,
		//required:true
    },
    

    date:Date
    
}));
function validatequalityassurance(obj){
	const schema={
        companyName:Joi.string().min(1).max(100).required(),
        orderId:Joi.number().min(1).max(100000000).required(),
         description:Joi.string().min(1).max(10000000).required(),
         price:Joi.number().min(6).max(100000000).required(),
         nameOfSupplier:Joi.string().min(1).max(1000000).required(),
         actualCompletionDate:Joi.date().required(),
         contractedDate:Joi.date().required(),
         marks:Joi.object().keys({completionPerformance:Joi.number().min(1).max(40).required(),
            qualityPerformance:Joi.number().min(1).max(40).required(),
            reliabilityPerformance:Joi.number().min(1).max(20).required(),
            Total:Joi.number().min(1).max(1000).required()
                }),
        note:Joi.string().min(1).max(1000000).required(),
        performanceRating:Joi.number().min(1).max(1000000).required(),
        nameOfAuthorizedPerson:Joi.string().min(1).max(1000000).required(),
        designationOfAuthorizedPerson:Joi.string().min(1).max(1000000).required(),
        tenderId:Joi.string()


}
    return Joi.validate(obj,schema);
}
exports.validatequalityassurance=validatequalityassurance;
exports.qualityAssurance=qualityAssurance;