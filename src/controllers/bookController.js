const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const validator = require('../validators/validation')
const moment = require('moment')
const lodash = require('lodash')
const jwt = require('jsonwebtoken')

//============================ post API for create book ===================================
const createBook = async function(req,res){
    try{
        let data = req.body
        if(Object.keys(data).length === 0){
            return res.status(400).send({status:false,msg:"Request Body is Empty!"})
        }
        
        let {title,excerpt,userId,ISBN,category,subcategory} = data
        
    

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
        // if(!validator.isValidIsbn(ISBN)){
        //     return res.status(400).send({status:false,msg:"ISBN is Invalid!"})
        // }
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


//============================ get  API for book by query===================================

const getBookByQuery = async function(req,res){
    try{
        let queryData = req.query
        
        let bookDetails = await bookModel
        .find({isDeleted:false, ...queryData})
        .select({
            _id:1,
            title:1,
            excerpt:1,
            userId:1,
            category:1,
            subcategory:1,
            reviews:1,
            releasedAt:1
          
        })
        if(bookDetails.length === 0){
            return res.status(404).send({status:false,message:"No Book Found!"})
        }
        //validation for extra key in query params
        let extraKeys = ["userId","category","subcategory"]
        for(field in queryData){
            if(!extraKeys.includes(field)){
                return res.status(400).send({status:false,message:"This filter is not valid!"})
            }
        }
        //sorting the title in alphabetical order with the help of lodash
        let sorted = lodash.sortBy(bookDetails,["title"])
        return res.status(200).send({status:true,data:sorted})
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}

//============================ get API for book by params ===================================
const getBookbyId= async function(req,res){
    try{
        let bookId=req.params.bookId
        //checkobjectId is valid or not
        if(validator.isIdValid(bookId)==false) {
             return res.status(400).send({status:false,message:"Book Id is not valid"})
            }

        let books=await bookModel.findOne({_id:bookId,isDeleted:false})
        
        if(!books) { 
            return res.status(400).send({status:false,message:"data doesnot exist or already deleted"})
        }
        let reviewDetails=await reviewModel.find({bookId:books._id})
      
        Object.assign(books,{reviewDetails:reviewDetails})
    
        res.status(200).send({status:true,message:"Booklist", data:books})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

//============================ Put api for updation ===================================
const updateBookById = async function(req,res){
    try{
        let bookId = req.params.bookId
        
        
        let bookDetails =  await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!bookDetails)
        return res.status(404).send({status:false,message:"Book not found!"})

        let data = req.body

       
        //updating

        let update = await bookModel.findByIdAndUpdate({
            _id:bookId},
            {
                $set:{
                    title:data.title,
                    ISBN:data.ISBN,
                    excerpt:data.excerpt,
                    releasedAt:moment(new Date()).format("YYYY-MM-DD")
                }
            },
            {new:true}
            );
            console.log(update)
            return res.status(200).send({status:true,data:update})
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}


//============================ delete api by params ===================================

const deleteBook =async function(req,res){
    try{
        let bookId = req.params.bookId
       
        if(!validator.isIdValid(bookId)){
            return res.status(400).send({status:false,message:"BookId is incorrect!"})
        }

        let bookDetails = await bookModel.findById(bookId)
        if(!bookDetails){
            return res.status(404).send({status:false,message:"Books Not Found!"})
        }

        if(bookDetails.isDeleted === true){
            return res.status(400).send({status:false,message:"Book is already deleted!"})
        }


    

    //delete
    let deleteDocument = await bookModel.findOneAndUpdate(
        {_id:bookId},
        {
            $set:{
                isDeleted:true,
                deletedAt:new Date()
            }
        }
    )
    return res.status(200).send({status:true,message:"Book is successsfully Deleted"})
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}
module.exports = { createBook,getBookByQuery,deleteBook,updateBookById }