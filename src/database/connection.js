const mongoose=require("mongoose");
var mongodbErrorHandler = require('mongoose-mongodb-errors')

console.log("Connecting" )


const DB=process.env.DATABASE;


mongoose.connect(DB).then(()=>{
    console.log("Successfully connection esatablished")
}).catch((Err)=>{
    console.log("Error is "+Err)
})


mongoose.plugin(mongodbErrorHandler);
