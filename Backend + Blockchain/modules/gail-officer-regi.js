const Joi=require("joi");
const mongoose=require("mongoose");
const date = require( "joi/lib/types/date" );
const number = require( "joi/lib/types/number" );

const GailOfficerRegistration=mongoose.model("GailOfficerRegistration",new mongoose.Schema({
    loginId:{
		type:String,
		required:true
    },
    password:{
		type:String,
		required:true
    },
    authority:{
		type:String,
		required:true
    },
    emailId:{
		type:String,
		required:true
    },
    employeeId:{
		type:String,
		required:true
    },
    phoneNumber:{
		type:Number,
		required:true
    },
    date:Date,

}));
function validateGailOfficerRegistration(obj){
    const schema={
        loginId:Joi.string().min(5).max(100).required(),
		password:Joi.string().min(8).required(),
		authority:Joi.string().min(5).max(100).required(),
        emailId:Joi.string().min(8).max(100).required(),
        employeeId:Joi.string().min(4).max(100).required(),
		phoneNumber:Joi.number().min(8).max(254684214233).required()
		
    }
    return Joi.validate(obj ,schema);
}
function validateUpdateGailOfficerRegistration(obj){
  const schema={
      
      password:Joi.string().min(8),
      emailId:Joi.string().min(8).max(100),
      phoneNumber:Joi.number().min(8).max(254684214233)
  }
  return Joi.validate(obj ,schema);
}
exports.GailOfficerRegistration=GailOfficerRegistration;
exports.validateGailOfficerRegistration=validateGailOfficerRegistration;
exports.validateUpdateGailOfficerRegistration=validateUpdateGailOfficerRegistration;