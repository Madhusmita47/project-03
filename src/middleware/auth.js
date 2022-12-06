const jwt = require("jsonwebtoken")
const bookModel = require('../models/bookModel')
//=========================== Authentication ==========================================

const Authentication=function (req,res,next){
    try {
    let token=req.headers["x-api-key"]
    if(!token) {return res.status(400).send({status:false,message:"token must be present"})}
 let decode =jwt.verify(token,"group 38")
 if(!decode) { return res.status(401).send({status:false,message:"user not authenticated"})}
 next()
    }
    catch (error) {
        res.status(500).send({status: false, msg: error.message })
    }
 }
const authorisation = async function(req,res,next){
    try{
        let bookId = req.params.bookId   //params


        let token = req.headers["x-api-key"] 
        let decoded = jwt.verify(token, 'group 38')     // {userId:"7979879789"}
    
        if (!decoded) {
            return res.status(400).send({ status: false, msg: "token is not valid" })
        }
        
        let userLoggedIn = decoded.userId
        
        let bookDetails =  await bookModel.findOne({_id:bookId,isDeleted:false})
        
        
        if (bookDetails.userId!= userLoggedIn)
            return res.status(401).send({ status: false, msg: 'user logged is not allowed to modify the requested books data' })
            else {
                next()
            }
    }
    catch (error) {
        res.status(500).send({status: false, msg: error.message })
    }
}
 module.exports = {Authentication,authorisation}