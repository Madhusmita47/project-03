const express=require('express')
const router=express.Router()

const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const {updateReview,deleteReview,createReviewByBookId} =require("../controllers/reviewcontroller")
const mid = require('../middleware/auth')


router.post('/register', userController.createUser)
//---------------------createBook--------------------
router.post('/books', mid.Authentication,bookController.createBook)
router.post('/login', userController.loginUser)
router.get('/books',mid.Authentication,bookController.getBookByQuery)
//------------------------getBookById-----------------------------
router.get('/books/:bookId',mid.Authentication,bookController.getBookbyId)
//----------------------update and delete-------------------------------------
router.put('/books/:bookId',mid.Authentication,mid.authorisation,bookController.updateBookById)
router.delete('/books/:bookId',mid.Authentication,mid.authorisation,bookController.deleteBook)
//----------------------create review,update and delete-------------
router.post('/books/:bookId/review',createReviewByBookId)
router.put('/books/:bookId/review/:reviewId',updateReview)
router.delete('/books/:bookId/review/:reviewId',deleteReview)


module.exports=router