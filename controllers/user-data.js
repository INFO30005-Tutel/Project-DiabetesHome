// Controller to perform CRUD on UserData parameter
const UserData = require('../models/user-data');
const helper = require('./helper');

exports.update = (req, res) => {
  
}

exports.getTodayData = (req, res) =>{
  var toReturn;
  UserData.find({userId: req.user._id}).then((dataBlock)=>{
    if(!dataBlock){
      res.status(404).send({message: "Missing user-data for this user!"});
    }
    // Get access to each of data elements
    var today = new Date();
  })
}

exports.getDataDuring = (req, res) =>{

}


// Debugging methods
exports.findOne = (req, res) => {
  helper.findData(UserData, req, res);
}
exports.findAll = (req, res) => {
  helper.findAllData(UserData, req, res);
}