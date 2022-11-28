const express=require('express')
const router=express.Router()

const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const mid = require('../middleware/auth')


router.post('/register', userController.createUser)
router.post('/books', bookController.createBook)
router.post('/login', userController.loginUser)


module.exports=router