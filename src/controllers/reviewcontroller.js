const mongoose = require("mongoose")
// const userModel=require("../models/userModel")
const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const Validator = require("../validators/validation")

//--------------createReviewByBookId------------------------------
const createReviewByBookId = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!bookId) return res.status(400).send({ status: false, msg: "please provide BookId" })

        if (!Validator.isIdValid(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid BookId or not present ` })
        }
       

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: `Book not found` })
        }

        let requestBody = req.body
        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, message: "Invalid request!! Please... Provide request body" })

        }

        const { reviewedBy, rating, review } = requestBody



        if (!Validator.isValidString(reviewedBy)) {
            return res.status(400).send({ status: false, message: " please provide reviewedBy" })
        }

        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating is mandatory" })
        }

        if (rating) {
            if (!(typeof rating == "number")) {
                return res.status(400).send({ status: false, message: "Rating should be a number" })
            }

            if (Number.isInteger(rating)) {
                if (rating < 1 || rating > 5) {
                    return res.status(400).send({ status: false, message: "Rating can only be 1,2,3,4,5" })
                }
            }
            else {
                return res.status(400).send({ status: false, message: "Rating can be only Integer and Whole Number" })
            }
        }


        let createReviewData = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt: Date.now(),
            rating: rating,
            review: review
        }
        let reviewData = await reviewModel.create(createReviewData)

        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })

        let newdata = await reviewModel.find(reviewData).select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 })

        res.status(201).send({ status: true, data: newdata })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }

}



//-----update review----------------
const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!Validator.isIdValid(bookId)) 
        { return res.status(400).send({ status: false, message: "invalid bookId" }) }

        let bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false})
        if (!bookExist) { return res.status(404).send({ status: false, message: "book doesn't exist" }) }

        if (!Validator.isIdValid(reviewId)) { return res.status(400).send({ status: false, message: "invalid reviewId" }) }

        let reviewExist = await reviewModel.findOne({ _id: reviewId, isDeleted: false})

        if (!reviewExist) { return res.status(404).send({ status: false, message: "review doesn't exist" }) }
        let data = req.body  

        let updateData = await reviewModel.findOneAndUpdate({ $and: [{ _id: reviewId }, { bookId: bookId }] },     { $set: { reviewedBy: data.reviewedBy, rating: data.rating, review: data.review } }, { new: true })
        if (!updateData) { return res.status(404).send({ status: false, message: "This Book does not have this review" }) }
        res.status(200).send({ status: true, message: updateData })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

//---------------delete review---------------
const deleteReview = async function (req, res) {
    try {
        let bookID = req.params.bookId
        let reviewId = req.params.reviewId

        if (Validator.isIdValid(bookID)==false) {
            return res.status(400).send({ status: false, mesage: "BookId is not valid!" })
        }
        let book = await bookModel.findOne({ _id: bookID, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found!" })
        }

        if (Validator.isIdValid(reviewId)==false) {
            return res.send(400).send({ status: false, mesage: "BookId is not valid!" })

        }
        let review = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        // console.log(review)
        if (!review) {
            return res.status(404).send({ status: false, message: "review is not found!" })
        }
        if (review.bookId!= bookID) {
            return res.status(404).send({ status: false, message: "Review not found!" })
        }

        if (review.isDeleted === true) {
            return res.status(400).send({ status: false, message: "This review is already deleted!" })
        }

        let reviewDelete = await reviewModel.findOneAndUpdate(
            { _id: reviewId },
            { $set: { isDeleted: true } })

        let updateBook = await bookModel.findOneAndUpdate(
            { _id: bookID },
            { $inc: { reviews: -1 } })
        res.status(200).send({ status: true, message: "Review document is deleted successfully!" })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}







module.exports = { updateReview, deleteReview, createReviewByBookId }