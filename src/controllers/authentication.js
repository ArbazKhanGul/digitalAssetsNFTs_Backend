exports.verify=async (req, res) => { 
    let user= req.session.user
    console.log("Printing user",user)
  
    if(req.session.user)
    {
      res.send({status :"success",user})
    }
    else
    {
      res.send({status :"failed"})
    }
    
}