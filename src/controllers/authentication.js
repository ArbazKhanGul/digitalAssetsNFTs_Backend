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