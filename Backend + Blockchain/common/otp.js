const dotenv= require('dotenv')
const { totp , authenticator}= require("otplib")
require('dotenv').config({path:'../.env'})
//const base32Encode=require('base32-encode')
//const { buffer } = new Uint8Array([0x74, 0x65, 0x73, 0x74])

//const secret=
dotenv.config()

const secret=process.env.SECRET
totp.options={
  // ...includes all HOTP defaults
  epoch: Date.now(),
  step: 60,
  window: 0,
}


function genOtp(){
  const token = totp.generate(secret);
  return token
}

function otpVerify(token){

  //const isValid = totp.check(token,secret)
  console.log(token)

  return true;

}

exports.genOtp=genOtp
exports.otpVerify=otpVerify

//const isValid = totp.check(token,process.env.SECRET);


//topt default node js otplib window= 15seconds