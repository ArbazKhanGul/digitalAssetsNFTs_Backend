exports.verify=async (req, res) => { 
  try{  
    console.log("🚀 ~ exports.verify= ~ req.user:", req.user)
    console.log("🚀 ~ exports.verify= ~ req.session.user:", req.session.user)
 
    let user= req.session.user
    console.log("🚀 ~ exports.verify= ~ user:", user)
  
    if(user)
    {
      res.send({status :"success",user})
    }
    else
    {
      res.send({status :"failed"})
    }
  }
  catch(error){
    console.log("🚀 ~ exports.verify= ~ error:", error)
    
  }
}

exports.adminVerify=async (req, res) => { 
  let user= req.session.user

  if(user && user.role=="admin")
  {
    res.send({status :"success",user})
  }
  else
  {
    res.send({status :"failed"})
  }
}