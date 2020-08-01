const Joi= require('joi')
const mongoose = require('mongoose')

const User=mongoose.model('User',new mongoose.Schema({
	authority:{
		type:String,
		required:true,
	},
	loginId:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true,
		maxlength:1024
	}

}));

function validateUser(user){
	const schema={
		authority:Joi.string().min(5).max(50).required(),
		loginId:Joi.string().min(5).max(1024).required(),
		password:Joi.string().min(8).max(1024).required(),
		
	}
	return Joi.validate(user ,schema);
}

exports.User=User;

exports.validateUser=validateUser;