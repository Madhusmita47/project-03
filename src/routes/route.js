const express=require('express')
const router=express.Router()

const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const mid = require('../middleware/auth')


router.post('/register', userController.createUser)
router.post('/books', mid.Authentication,bookController.createBook)
router.post('/login', userController.loginUser)
router.get('/books',mid.Authentication,bookController.getBookByQuery)
router.delete('/books/:bookId',mid.Authentication,bookController.deleteBook)


module.exports=router