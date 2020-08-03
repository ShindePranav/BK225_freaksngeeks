//all are the requirentments to run the project
const express = require('express');
const app = express();
const ngrok=require('ngrok')
const user= require('./routes/user');
const otpVerification=require('./routes/forget-password')
const gailOfficerRegistration= require('./routes/gail-officer-regi-b');
const bidderRegistrtion=require('./routes/bidder-registration-b')
const gailAuthorityDashboard=require('./routes/GailAuthority-Dashboard')
const projectEngineerDashborad=require('./routes/ProjectEngineer-Dashboard')
const bidderDashboard=require('./routes/bidder-dashboard')
const tenderDetail=require('./routes/tender-details-b')
const home=require("./routes/home")
const {Authorization} = require('./common/authServer')
/// Author Vaibhavi
const shippingservices=require('./routes/shippingservices-b')
const qualityassurance=require('./routes/QualityAssurance-Dashboard')
const acceptbid=require("./routes/acceptbidder")
//blockchain
const {projectEnggAddress}=require("./common/blockchainaccounts")


//console.log(projectEnggAddress);
const mongoose= require('mongoose');
//const nodemailer=require ('nodemailer');
var cors = require('cors');

app.options('*', cors()); 

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
    next();
});

var whitelist = ['*']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}




// COnnection to mongo db server
mongoose.connect('mongodb+srv://pranav:pranav@cluster0.rorwe.gcp.mongodb.net/gail?retryWrites=true&w=majority')
	.then(()=> console.log("connected to Database"))
  .catch(err=> console.error("Could not connect to mongo db."+ err))
//Online
/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://pranav:pranav@cluster0.rorwe.gcp.mongodb.net/gail?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/




//MiddleWare for program-> all the api and route are mapped here
app.use(cors()); 
app.use(express.json());

app.get('/home', function(req, res) {
  
  res.status(301).redirect('http://freaksngeeks.ml');
});
app.use('/gail',user);//done
app.use('/' ,home);
//app.use('/gail',user);//done
var bodyParser = require('body-parser');
app.use(bodyParser({defer: true}));
app.use('/gail/bidderregistration',bidderRegistrtion);
app.use('/gail/gailofficerregistration',gailOfficerRegistration)
app.use('/gail/forgetpassword',otpVerification)
app.use('/gail/gailAuthorityDashboard',gailAuthorityDashboard)
app.use('/gail/projectEngineerDashboard',projectEngineerDashborad)
app.use('/gail/bidderDashboard',bidderDashboard)
app.use('/gail/tenderDetailRegistration',tenderDetail)
app.use('/gail/shippingservices',shippingservices)
app.use('/gail/qualityassurance',qualityassurance)
app.use('/gail/acceptbid',acceptbid)

//Upload and serve file
//app.use(express.static('uploadAccetedRFQ'));
//app.use('/images', express.static(__dirname + '/Images'));






//starting the server with port 3000
const Port = process.env.PORT || 3000;
app.listen(Port,()=> {
	console.log(`Listening Dude Feel Safe at ${Port}`);
	(async function(){
		const endpoint= await ngrok.connect(Port);
		console.log(' ${endpoint}' )
	})

});