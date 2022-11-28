const jwt = require("jsonwebtoken")

//=========================== Authentication ==========================================

const Authentication=function (req,res,next){
    try {
    let token=req.header["x-auth-token"]
    if(!token) {return res.status(400).send({status:false,message:"token must be present"})}
 let decode =jwt.verify(token,"group 38")
 if(!decode) { return res.status(401).send({status:false,message:"user not authenticated"})}
 next()
    }
    catch (error) {
        res.status(500).send({status: false, msg: error.message })
    }
 }

 module.exports = {Authentication}