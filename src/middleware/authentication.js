// const jwt = require("jsonwebtoken");
// const User = require("../database/user");
exports.authenticate=async (req,res,next)=>{

    let user= req.session.user
    if(user)
    {
      req.user=user;
      next();
    }
    else
    {
        throw new Error("Not authorized");
    }

}



exports.adminAuthenticate=async (req,res,next)=>{

  let user= req.session.user
  
  if(user && user.role=="admin")
  {
    req.user=user;
    next();
  }
  else
  {
      throw new Error("Not authorized");
  }

}