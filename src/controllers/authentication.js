exports.verify=async (req, res) => { 
    let user= req.session.user
  
    if(user)
    {
      res.send({status :"success",user})
    }
    else
    {
      res.send({status :"failed"})
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