
const Joi= require('joi')
const mongoose=require('mongoose'); 
const GailShippingAuthority=mongoose.model('shippingservices',new mongoose.Schema({
 /*    OwnShippingServices:{
		type:Boolean,
		default:false,
    },
    GailShippingServices:{
       type:Boolean,
		default:false,
    },*/
companyName:{
    type:String,
    default:false,
},
containerID:{
    type:Number,
    default:false,
},
itemId:{
    type:Number,
    default:false,
}, // Tracking Number
orderRefNumber:{
    type:Number,
    default:false,
},
contactPersonName:{
    type:String,
    default:false,
},
contactPersonMobo:{
    type:Number,
    default:false,
},
contactPersonEmailId:{
    type:String,
    default:false,
},
postalCode:{
    type:Number,
    default:false

},
    date:Date
}));
const OwnShippingAuthority=mongoose.model('OtherShippingAuthority',new mongoose.Schema({
    /*    OwnShippingServices:{
           type:Boolean,
           default:false,
       },
       GailShippingServices:{
          type:Boolean,
           default:false,
       },*/
   companyName:{
       type:String,
       default:false,
   },
   containerID:{
       type:Number,
       default:false,
   },
   itemId:{
       type:Number,
       default:false,
   }, // Tracking Number
   OrderRefNumber:{
       type:Number,
       default:false,
   },
   contactPersonName:{
       type:String,
       default:false,
   },
   contactPersonMobNo:{
       type:Number,
       default:false,
   },
   contactPersonEmailId:{
       type:String,
       default:false,
   },
   postalCode:{
    type:Number,
    default:false

},
       date:Date
   }));
function validateshippingservices(obj){
    const schema={	
      //  OwnShippingServices:Joi.boolean(),
      //  GailShippingServices:Joi.boolean()
      companyName:Joi.string().min(1).max(1000000000).required(),
      containerID:Joi.number().min(1).max(10000000000).required(),
itemId:Joi.number().min(1).max(10000000).required(),
orderRefNumber:Joi.number().min(1).max(1000000).required(),
contactPersonName:Joi.string().min(1).max(100).required(),
contactPersonMobNo:Joi.number().min(1).max(10000000000000).required(),
contactPersonEmailId:Joi.string().min(1).max(10000000000).required(),
postalCode:Joi.number().min(1).max(1000000000000)
    }
    return Joi.validate(obj,schema); 
}
exports.validateshippingservices=validateshippingservices;
exports.GailShippingAuthority=GailShippingAuthority;
exports.OwnShippingAuthority=OwnShippingAuthority;
