const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
const { isValidString, isValidName, isValidPhone, isValidEmail, isValidPassword,isValidtitle, isvalidPincode  } = require("../validators/validation");

//============================ post API for create user ===================================

const createUser = async function (req, res) {
    try {
        let data = req.body;
        let {title , name, phone, email, password, address} = data;
        
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, msg: "Body can not empty" })
        }
        if (!isValidString(title)) {
            return res.status(400).send({ status: false, msg: "title can not found" })
        }
        if(!isValidtitle(title)){
            return res.status(400).send({status:false,message:"Title is not valid"})
        }
       if (!isValidString(name)) {
           return res.status(400).send({ status: false, msg: "Name not found" })
       }
       if(!isValidName(name)) {
           return res.status(400).send({ status: false, msg: "Name is invalid" })
        }
        if (!isValidString(phone)) {
            return res.status(400).send({ status: false, msg: "Phone number not found" })
        }
        if(!isValidPhone(phone)) {
           return res.status(400).send({ status: false, msg: "Phone number is invalid" })
        }
        let phoneExist = await userModel.findOne({phone:phone})
        if(phoneExist){
            return res.status(400).send({status:false, msg: "phone number already exist"})
        }
        if (!isValidString(email)) {
            return res.status(400).send({ status: false, msg: "email not found" })
        }
        if(!isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "email is invalid" })
        }
        let emailExist = await userModel.findOne({email:email})
        if(emailExist){
            return res.status(400).send({status:false, msg: "email-Id already exist"})
        }
        if (!isValidString(password)) {
            return res.status(400).send({ status: false, msg: "password not found" })
        }
        if(!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "password is invalid" })
        }
        if (!isValidString(address)) {
            return res.status(400).send({ status: false, msg: "address not found" })
        }
        let {street, city, pincode} = address
       
        if(!isValidString(street)){
            return res.status(400).send({status:false, msg: "street not found"})
        }
       
        if(!isValidString(city)){
            return res.status(400).send({status:false, msg: "city not found"})
        }
        if(!isValidString(pincode)){
            return res.status(400).send({status:false, msg: "pincode not found"})
        }
        if(!isvalidPincode(pincode)){
            return res.status(400).send({status:false, msg: "invalid pincode"})
        }
        
        let savedData = await userModel.create(data)
        res.status(201).send({ status: true, msg:"new user is created", data: savedData })
    }
    
    catch (error) {
        res.status(500).send({status: false, msg: error.message })
    }
};

//============================ post API for login user ===================================

let loginUser=async function(req,res){
    try{
      let data=req.body
      if(Object.keys(data).length===0) {
        return res.status(400).send({status:false,message:"data is not present"})
    }
      email=req.body.email
      password=req.body.password
      
     if(!(email)) {
        return res.status(400).send({status:false,message:"email is mandatory"})
    }
  
    if(!isValidEmail(email)) {
        return res.status(400).send({ status: false, msg: "email is invalid" })
    }
  
     if(!(password)) { 
        return res.status(400).send({status:false,message:"password is mandatory"})
    }
  
    if(!isValidPassword(password)) {
        return res.status(400).send({ status: false, msg: "password is invalid" })
    }
  
      let userPresent=await userModel.findOne({email:email,password:password})
  
      if(!(userPresent)) {
         return res.status(400).send({status:false,message:"email or password is incorrect"})
        }
  
      let token=jwt.sign({
          userId:userPresent._id.toString(),
      
      },"group 38",{expiresIn:"1hr"},{iat:Date.now()})
  
      res.setHeader("x-auth-token",token)
      res.status(200).send({status:true,token:token,expiresIn:"1hr",issuedAt:Date.now()})
  
    }
    catch(err){
      res.status(500).send({status:false,messege:err.message})
    }
  }



module.exports = { createUser, loginUser}

