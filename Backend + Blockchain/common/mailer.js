const nodemailer=require ('nodemailer');
const { response } = require( 'express' );
let fromMail='wefreaksngeeks@gmail.com';
//let toMail='pranavshinde999@gmail.com';
//let subject='An email using nodejs app';
//let text='😅';

const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    auth:{
        user:fromMail,
        pass:'FreaksNGeeks@2019'
        }
});

exports.transporter=transporter;
exports.fromMail=fromMail;

/*email options
let mailoptions={
    from:fromMail,
    to:toMail,
    subject:subject,
    text:text
}

//send email
transporter.sendMail(mailoptions,(error,response)=>{
    if(error){
        console.log(error);
    }
    console.log(response)
});*/


