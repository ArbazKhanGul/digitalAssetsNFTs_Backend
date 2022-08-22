const mongoose=require("mongoose");
// require("dotenv").config({path: "./src/config.env" });

console.log("Connecting" )


const DB=process.env.DATABASE;


mongoose.connect(DB).then(()=>{
    console.log("Successfully connection esatablished")
}).catch((Err)=>{
    console.log("Error is "+Err)
})