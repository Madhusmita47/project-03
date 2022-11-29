const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const validator = require('../validators/validation')
const moment = require('moment')
const lodash = require('lodash')
const jwt = require('jsonwebtoken')
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


// get book

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

//get by param
const getBookbyId= async function(req,res){
    try{
        let bookId=req.params.bookId
        //checkobjectId is valid or not
        if(validator.isIdValid(bookId)==false) { return res.status(400).send({status:false,message:"Book Id is not valid"})}

        let books=await bookModel.findOne({_id:bookId,isDeleted:false})
        
        if(!books) { return res.status(400).send({status:false,message:"data doesnot exist or already deleted"})}
        let reviewDetails=await reviewModel.find({bookId:books._id})
      
        Object.assign(books,{reviewDetails:reviewDetails})
    
        res.status(200).send({status:true,message:"Booklist", data:books})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

//update
const updateBookById = async function (req, res){
    try {
      const reqBody = req.body
      const bookId = req.params.bookId
      const { title, excerpt, ISBN, releasedAt } = reqBody
  
      //------------------------------body validation-----------------------------------
      if (!dataValidation(reqBody))
        return res.status(400).send({ status: false, message: 'Please fill the data' })
  
      if (Object.keys(reqBody).length > 4)
        return res.status(400).send({ status: false, message: 'You can not add extra field' })
  
      //------------------------------bookId validation-----------------------------------
      if (!isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: `No book found by this bookId '${bookId}'` })
  
      //------------------------------title validation-----------------------------------
      if (!isValidTitle(title))
        return res.status(400).send({ status: false, message: 'title is not valid' })
  
      //------------------------------excerpt validation-----------------------------------
      if (excerpt)
        if (!isValidText(excerpt))
          return res.status(400).send({ status: false, message: 'excerpt is not valid' })
  
      //------------------------------ISBN validation-----------------------------------
      if (ISBN)
        if (!isValidIsbn(ISBN))
          return res.status(400).send({ status: false, message: 'ISBN is not valid' })
  
      //------------------------------isValidDate validation-----------------------------------

  
      //-------------------finding Book by id through params----------------------
      const book = await bookModel.findById(bookId);
  
      if (!book)
        return res.status(404).send({ status: false, message: 'Book not found' });
  
      //---------------------------checking authorization-----------------------------
      if (req.user != book.userId)
        return res.status(403).send({ status: false, message: `This '${bookId}' person is Unauthorized.` });
  
      if (!book)
        return res.status(404).send({ status: false, message: "Book not found" });
  
      if (book.isDeleted === true)
        return res.status(400).send({ status: false, message: `This '${bookId}' book is already deleted.` })
  
      //---------------------------finding duplicate title---------------------------
      if (book.title === title)
        return res.status(400).send({ status: false, message: 'title is Duplicate' })
  
      //------------------------------finding duplicate ISBN------------------------------
      if (book.ISBN === ISBN)
        return res.status(400).send({ status: false, message: 'ISBN is Duplicate' })
  
      //------------------------------book updation------------------------------
      const updatedBook = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: reqBody }, { new: true });
  
      res.status(200).send({ status: true, message: "Updated Successfully", data: updatedBook })
  
    }
    catch (err) {
      res.status(500).send({ status: false, error: err.message })
    }
  }

//Delete api

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

    //authorisation
    let token = req.headers["x-auth-token"]
    let decoded = jwt.verify(token, 'group 38')

    if (!decoded) {
        return res.status(400).send({ status: false, msg: "token is not valid" })
    }
    
    let userLoggedIn = decoded.userId
    

    if (bookDetails.userId!= userLoggedIn)
        return res.status(401).send({ status: false, msg: 'user logged is not allowed to modify the requested books data' })

    //delete
    let deleteDocument = await bookModel.findOneAndUpdate(
        {_id:data},
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
module.exports = { createBook,getBookByQuery,deleteBook }