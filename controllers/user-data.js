// Controller to perform CRUD on user parameter
const User = require('../models/user-data');
const helper = require('./helper');

exports.update = (req, res) => {
  
}

exports.getTodayData = (req, res) =>{

}

exports.getDataDuring = (req, res) =>{

}


// Debugging methods
exports.findOne = (req, res) => {
  helper.findData(User, req, res);
}
exports.findAll = (req, res) => {
  helper.findAllData(User, req, res);
}