const Joi=require("joi");
const mongoose=require("mongoose");//orm

const tenderDetailRegistration=mongoose.model("tenderDetailRegistration",new mongoose.Schema({
    tenderId:{
		type:String,
		required:true
    },
   // activeBid:{
		//type:String,
		//required:true
   // },
    tenderTitle:{
		type:String,
		required:true
    },
    referenceNo:{
		type:Number,
		required:true
    },
    closingDate:{
		type:Date,
        min:'2019-5-28',
        max:'2021-6-30'
    },
    bidOpeningDate:{
		type:Date,
        min:'2019-5-28',
        max:'2021-6-30'
    },
    tenderStatus:{
		type:String,
		required:true
    },
    tenderType:{
		type:String,
		required:true
    },
    //authority removed
    tenderLocation:{
		type:String,
		required:true
    },
    itemId:{
      type:String,
      required:true
    },
    unit:{
      type:String,
      required:true
    },
    product:{
      type:String,
      required:true
    },
    quantity:{
      type:String,
      required:true
    },
    productCategory:{
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true
    },
     productId:{
      type:String,
      required:true
     },
     itemType:{
      type:String,
      required:true
     },///added currency
     currencyType:{
       type:String,
       required:true
     },
     

    date:Date
}));

function validatetenderDetailRegistration(obj){
    const schema={
        tenderId:Joi.string().min(1).max(100).required(),
		//activeBid:Joi.string().min(5).max(100).required(),
		tenderTitle:Joi.string().min(4).max(100).required(),
        referenceNo:Joi.string().min(3).max(100).required(),
		closingDate:Joi.date().required(),
        bidOpeningDate:Joi.date().required(),
        tenderStatus:Joi.string().min(3).max(100).required(),
		tenderType:Joi.string().min(1).max(100).required(),
        //authority:Joi.string().min(4).max(100).required(),
    tenderLocation:Joi.string().min(4).max(100).required(),
    itemId:Joi.string().min(4).max(100).required(),
  unit:Joi.string().min(1).max(100).required(),
  product:Joi.string().min(1).max(100).required(),
  quantity:Joi.string().min(1).max(100).required(),
  productCategory:Joi.string().min(1).max(100).required(),
  description:Joi.string().min(1).max(100).required(),
  productId:Joi.string().min(1).max(100).required(),
  itemType:Joi.string().min(1).max(100).required(),
  currencyType:Joi.string().min(1).max(10).required(),
    }
    return Joi.validate(obj,schema); 
}
function validateupdatetenderDetailRegistration(obj){
  const schema={
      tenderId:Joi.string().min(1).max(100),
  //activeBid:Joi.string().min(5).max(100),
  tenderTitle:Joi.string().min(4).max(100),
      referenceNo:Joi.string().min(8).max(100),
  closingDate:Joi.date(),
      bidOpeningDate:Joi.date(),
      tenderStatus:Joi.string().min(3).max(100),
  tenderType:Joi.string().min(1).max(100),
     // authority:Joi.string().min(4).max(100),
  tenderLocation:Joi.string().min(4).max(100),
  itemId:Joi.string().min(1).max(100),
unit:Joi.string().min(1).max(100),
product:Joi.string().min(1).max(100),
quantity:Joi.string().min(1).max(100),
productCategory:Joi.string().min(4).max(100),
description:Joi.string().min(4).max(100),
productId:Joi.string().min(1).max(100),
itemType:Joi.string().min(1).max(100),
currencyType:Joi.string().min(1).max(10)
  }
  return Joi.validate(obj,schema); 
}
module.exports.validatetenderDetailRegistration=validatetenderDetailRegistration;
module.exports.validateupdatetenderDetailRegistration=validateupdatetenderDetailRegistration;
module.exports.tenderDetailRegistration=tenderDetailRegistration;