require("express-async-errors");
const express = require("express");
require("dotenv").config();
const router = require("./src/Router/router");
const stripe_router=require("./src/Router/srtripe_router")
const cors = require("cors");
const morgan = require("morgan");
require("./src/database/connection");
const path = require("path");
const session=require("express-session");
const RedisStore = require('connect-redis')(session);
var redis=require('redis')
var listenEvent=require('./src/utils/listenEvent')

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL,"http://localhost:3000"],
    credentials: true,
  })
);


listenEvent();
//Redis connection
// var Redisclient=redis.createClient(
//   {
//   host: 'localhost',
//   port: 6379,
//   legacyMode: true 
// }
// );
// Redisclient.on('error', function (err) {
//   console.log('Could not establish a connection with redis. ' + err);
// });
// Redisclient.connect()




app.use(express.static("public"));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/src/views"));
// app.use(morgan('combined'));
app.use(express.json({
  verify:(req,res,buffer)=>req['rawBody']=buffer
}));
app.use(express.urlencoded({ extended: true }));




//express session
app.use(session({
  // store: new RedisStore({ client: Redisclient }),
  secret:process.env.SECRET_KEY_SESSION,
  resave:false,
  saveUninitialized:false,
  cookie:{
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie 
      // maxAge: 1000 * 60 * 10 // session max age in miliseconds
      // sameSite: 'none',
  },
  
  }))

  
///allroutes
app.use(router);
app.use(stripe_router);

//images host
app.use("/images",express.static("images"));


//404 handle

app.use((req, res, next) => {
  req.status = 404;
  const error = new Error("Routes not found");
  next(error);
});

//error handling

// if (app.get("env") === "production") {
//   app.use((error, req, res, next) => {
//     res.status(req.status || 500).send({
//       message: error.message,
//     });
//   });
// }


app.use((error, req, res, next) => {
  console.log("🚀 ~ file: app.js ~ line 94 ~ app.use ~ error", error.message);

  let response = error.message;

  if (response == "jwt expired") {
    res.render("failure",{
      client:process.env.CLIENT_URL+"/sendEmail"
  });
    return;
  }
  if (error?.keyValue?.address) {
    response = "Wallet Address already exit";
  }

  if (error?.keyValue?.email) {
    response = "Email already exist";
  }

  res.status(req.status || 500).send({
    message: response,
    // stack: error.stack,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Listening at port number " + process.env.PORT);
});
