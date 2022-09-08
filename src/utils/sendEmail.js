const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const hbs=require("nodemailer-express-handlebars");
const path = require('path')

const sendEmail = async (obj) => {



  const { _id, email } = obj;

 let token = jwt.sign({ _id}, process.env.SECRET_KEY,{

  expiresIn: '1h' // expires in 24 hours
  // expiresIn : '1m'
   });
   




// path

  let  pth=path.join(__dirname,"../views");


// Create a transporter
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      // service: "SendinBlue",
    // service:"gmail",
      port: 587,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });




// testings

transporter.verify((error,success) => {
if (error) {
console.log("🚀 ~ file: sendEmail.js ~ line 22 ~ transporter.verify ~ error", error)
}
else {
    console.log("Ready for message");
    console.log("🚀 ~ file: sendEmail.js ~ line 21 ~ transporter.verify ~ success", success)    
}
})




// set handlebars

transporter.use('compile',hbs({
  extName: ".handlebars",
  viewEngine:{
    extName: ".handlebars",
    partialsDir: pth,
    defaultLayout: false,
  },
  viewPath:pth,
}))




// mailobject

const mailObj = {
  from: `${process.env.SENDER_EMAIL}`,
  to:[email],
  subject: "[Golden Words NFTs] Singup Verification Email",

  attachments: [
{
  filename: 'logo.png',
  path: __dirname +'/assets/logo.png',
  cid: 'logo'
},
],
  template:'main',
  context: {
    ref: `${process.env.SERVER_URL}/verify/${token}`
}
};



// send Email

transporter.sendMail(mailObj,(error, info) => {
  if (error) {
    console.log(error);
  } else {

    console.log("Successfully sent")
  }
}
  )





};








module.exports= sendEmail;
