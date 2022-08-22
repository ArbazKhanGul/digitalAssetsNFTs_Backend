require('express-async-errors');
const express = require("express");
require('dotenv').config()
const router = require("./Router/router");
const cors = require("cors");
const morgan=require("morgan")
require("./database/connection");
const path = require('path')


const app = express();
app.use(
    cors({
      origin: [process.env.CLIENT_URL],
      credentials: true,
    }));
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));


app.use(router);





//404 handle

app.use((req,res,next)=>{
req.status=404;
const error=new Error("Routes not found");
next(error);
})

//error handling

if(app.get('env')==='production')
{
  app.use((error,req,res,next)=>{
    res.status(req.status || 500).send({
      message: error.message
    })
    })
}


app.use((error,req,res,next)=>{


  console.log("🚀 ~ file: app.js ~ line 50 ~ app.use ~ error", error.message);

                   

                  let response=error.message;
                            
                            if(response=="jwt expired")
                            {
                              res.render("failure");
                              return;
                            }
                            if(error?.keyValue?.address)
                            {
                             response="Wallet Address already exit"
                            }

                            if(error?.keyValue?.email)
                            {
                            response="Email already exist"
                            }

                           

  res.status(req.status || 500).send({
    message: response,
    stack: error.stack
  })



  })


app.listen(process.env.PORT, () => {
    console.log("Listening at port number " + process.env.PORT);
  });