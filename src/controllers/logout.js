exports.logout=async (req, res) => { 

    console.log("Backend")
    res.clearCookie('connect.sid');
    req.session.destroy((err)=>{
        console.log(err)
    });

        res.send({status:"success"});   
}