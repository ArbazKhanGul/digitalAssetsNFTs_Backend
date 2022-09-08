const jwt = require("jsonwebtoken");
const User = require("../database/user");
exports.authenticate=async (req,res,next)=>{
let token=req?.headers?.authorization;
if(!token)
{
    throw new Error("Not authorized");
}
const verifyToken = jwt.verify(token, process.env.SECRET_KEY_LOGIN);

const user = await User.findOne({ _id: verifyToken._id });


if(!user)
{
    throw new Error("User not found");
}
req.user=user;
next();
}