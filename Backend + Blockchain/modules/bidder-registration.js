const Joi= require('joi')
const mongoose = require('mongoose');
const { unique } = require('underscore');
const {qualityAssurance}=require('../modules/qualityassurance')


const BidderRegistration=mongoose.model('BidderRegistration',new mongoose.Schema({

	//Bidder Id is auto generated
	bidderId:{
		type:String,
		required:true,
	},

	//Login Details
	loginId:{
		type:String,
		required:true,
	},
	password:{
		type:String,
		required:true,
	},
	correspondenceEmail:{
		type:String,
		required:true
	},
	mobileNumber:{
		type:Number,
		required:true,
		maxlength:10
	},
	
	//Company Details
    companyName:{
		type:String,
		required:true,
        
    }, 
    preferentialBidder:{
		type:Boolean,
		required:true,
        
    },
    registrationNumber:{
		type:String,
		required:true,
        
    },
    registeredAddress:{
		type:String,
		required:true,
        
    },
    nameOfPartners:{
		type:String,
		required:true,
        
    },
    bidderType:{
		type:String,
		required:true,
        
    },
    city:{
		type:String,
		required:true,
        
    },
    state:{
		type:String,
		required:true,
        
    },
    postalCode:{
		type:String,
		required:true
        
    },
    panTanNumber:{
		type:String,
		required:true
        
	},
	establishmentYear:{
		type: Date,
		// The dates of the first and last episodes of
		// Star Trek: The Next Generation
		min: '1950-09-28',
		max: '2020-01-01'
	  },
	natureOfBusiness:{
		type:String,
		required:true
	},

	legalStatus:{
		type:String,//Dropdown list
		required:true
	},
	companyCategory:{
		type:String,//Dropdown list
		required:true
	},
	
	//Contact Person Details
	title:{
		type:String,//Dropdown list
		required:true
	},
	contactName:{
		type:String,
		required:true
	},
	dateOfBirth:{
		type:Date,
		required:true
	},
	designation:{
		type:String,
		required:true
	},
	phoneNumber:{
		type:String,
		required:true,
		unique:true
	},
	//How to take nested document 
	quality:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"qualityAssurance"
	},
	card:{
		type:String
		
	},
	cardDate:{
		type:Date
	},
	accountAddress:{
		type:String
	},
	accountBalance:{
        type:String
	}
	


	

}));

function validateBidderRegistration(obj){
	const schema={

		loginId:Joi.string().min(5).max(50).required(),
		password:Joi.string().min(8).max(50).required(),
		correspondenceEmail:Joi.string().max(1024).required().email(),
        mobileNumber:Joi.number().min(8).max(777777777777).required(),
        companyName:Joi.string().min(8).max(1024).required(),
        preferentialBidder:Joi.boolean().required(),
        registrationNumber:Joi.string().min(8).max(1024).required(),
        registeredAddress:Joi.string().min(8).max(1024).required(),
        NameOfPartners:Joi.string().min(8).max(1024).required(),
        bidderType:Joi.string().min(8).max(1024).required(),
        city:Joi.string().min(8).max(1024).required(),
        state:Joi.string().min(8).max(1024).required(),
        postalCode:Joi.string().min(6).max(1024).required(),
		panTanNumber:Joi.string().min(8).max(1024).required(),
		establishmentYear:Joi.date(),
		natureOfBusiness:Joi.string().required(),
		legalStatus:Joi.string().required(),
		companyCategory:Joi.string().required(),
		title:Joi.string().required(),
		contactName:Joi.string().required(),
		dateOfBirth:Joi.string().required(),
		designation:Joi.string().required(),
		phoneNumber:Joi.number().required()
		
	}
	return Joi.validate(obj ,schema);
}
function validateupdateBidderRegistration(obj){
	const schema={
		
		password:Joi.string().min(8).max(50),
		correspondenceEmail:Joi.string().max(1024),
        //mobileNumber:Joi.number().min(8).max(777777777777),   
        preferentialBidder:Joi.boolean(),
        registeredAddress:Joi.string().min(8).max(1024),
        NameOfPartners:Joi.string().min(8).max(1024),
        bidderType:Joi.string().min(8).max(1024),
        city:Joi.string().min(8).max(1024),
        state:Joi.string().min(8).max(1024),
        postalCode:Joi.string().min(6).max(1024),
		panTanNumber:Joi.string().min(8).max(1024),
		natureOfBusiness:Joi.string(),
		legalStatus:Joi.string(),
		companyCategory:Joi.string(),
		title:Joi.string(),
		contactName:Joi.string(),
		dateOfBirth:Joi.string(),
		designation:Joi.string(),
		phoneNumber:Joi.number()
		
	}
	return Joi.validate(obj ,schema);
}

exports.BidderRegistration=BidderRegistration;

exports.validateBidderRegistration=validateBidderRegistration;

exports.validateupdateBidderRegistration=validateupdateBidderRegistration;