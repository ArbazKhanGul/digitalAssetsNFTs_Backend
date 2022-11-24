// const jwt = require("jsonwebtoken");
// const User = require("../database/user");
exports.authenticate=async (req,res,next)=>{

    let user= req.session.user
    // console.log("Printing user",user)
  
    if(user)
    {
      req.user=user;
      next();
    }
    else
    {
        throw new Error("Not authorized");
    }
    
// let token=req?.headers?.authorization;
// if(!token)
// {
 
// }
// const verifyToken = jwt.verify(token, process.env.SECRET_KEY_LOGIN);

// const user = await User.findOne({ _id: verifyToken._id });


// if(!user)
// {
//     throw new Error("User not found");
// }
// req.user=user;
// next();
}