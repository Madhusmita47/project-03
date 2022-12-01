const mongoose = require('mongoose')
const moment = require('moment')
//=========================// isValidEmail //===================================

const isValidEmail = function (value) {
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (emailRegex.test(value)) return true;
};

//============================// idCharacterValid //============================

const isIdValid = function (value) {
  return mongoose.Types.ObjectId.isValid(value); 
};

//==========================// isValidString //==================================

const isValidString = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//==============================// isValidName //===============================

const isValidName = function (name) {
  if (/^[a-zA-Z ]+$/.test(name)) {
    return true;
  }
};

//==============================// isValidMobile //===============================

const isValidPhone = function (phone) {
 if (/^[0]?[6789]\d{9}$/.test(phone)){
    return true
 }
}
//==============================// isValidPassword //==============================

const isValidPassword = function(password){
  if (/^(?=.*[0-9])(?=.*[!.@#$%^&*])[a-zA-Z0-9!.@#$%^&*]{8,15}$/.test(password)){
    return true
  }
}

//==============================// isValidISBN //==============================
const isValidIsbn = function(ISBN){
  if ((/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))){
    return true
  }
}
//==============================// isValidtitle //==============================
const isValidtitle = function(title){
  if (title =="Mr" || title=="Mrs" || title =="Miss"){
    return true
  }
}
//==============================// isValid-date //==============================

const isValidDate = function (date) {
  if (typeof date != "string") return false
  return moment(date, 'YYYY-MM-DD', true).isValid()
}
//==============================// isValid-pincode //==============================

const isvalidPincode = function (pincode) {
  if (/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(pincode)) return true
  return false
}
//=============================// module exports //==============================

module.exports = { isValidEmail, isIdValid, isValidString, isValidName, isValidPhone, isValidPassword,isValidIsbn,isValidtitle, isValidDate, isvalidPincode }