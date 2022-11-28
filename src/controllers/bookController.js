const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const validator = require('../validators/validation')
const moment = require('moment')


const createBook = async function(req,res){
    try{
        let data = req.body
        if(Object.keys(data).length === 0){
            return res.status(400).send({status:false,msg:"Request Body is Empty!"})
        }
        
        let {title,excerpt,userId,ISBN,category,subcategory, releaseAt} = data
        
    

        //checking for Title
        if(!validator.isValidString(title)){
            return res.status(400).send({status:false,msg:"Please Enter Title!"})
        }
        let checktitle = await bookModel.findOne({title:title})
        if(checktitle){
            return res.status(400).send({status:false,msg:`$(title)==>title is already reserved!`})
        }

        //checking for excerpt
        if(!validator.isValidString(excerpt)){
            return res.status(400).send({status:false,msg:"Please Enter Excerpt!"})
        }
        
        //checking for userID
        if(!validator.isValidString(userId)){
            return res.status(400).send({status:false,msg:"Please Enter userId!"})
        }
        if(!validator.isIdValid(userId)){
            return res.status(400).send({status:false,msg:"UserID is Invalid!"})
        }
        let userbyID = await userModel.findById(userId)
        if(!userbyID){
            return res.status(400).send({status:false,msg:"This userId is not exists"})
            
        }

        //checking for ISBN
        if(!validator.isValidString(ISBN)){
            return res.status(400).send({status:false,msg:"Please Enter ISBN!"})
        }
        let checkISBN = await bookModel.findOne({ISBN:ISBN})
        if(checkISBN){
            return res.status(400).send({status:false,msg:"ISBN already exists"})
        }
        // checking category
        if(!validator.isValidString(category)){
            return res.status(400).send({status:false,msg:"Please Enter category"})
        }
        // checking subcategory
        if(!validator.isValidString(subcategory)){
            return res.status(400).send({status:false,msg:"Please Enter subcategory"})
        }
        // checking releaseAt
        // if(!validator.isValidString(releaseAt)){
        //     return res.status(400).send({status:false,msg:"Please Enter release At"})
        // }
        data["releaseAt"] = moment(new Date()).format("YYYY-MM-DD")

        //create Book
        let saveData = await bookModel.create(data)
        return res.status(201).send({status:true,data:saveData})
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}

module.exports = { createBook }