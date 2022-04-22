// Controller to perform CRUD on UserData parameter
const UserData = require('../models/user-data');
const helper = require('./helper');

// {
//   type: int (type index),
//   data: double/float/number
// }
exports.update = async (req, res) => {
  let savedData;
  await UserData.findOne({userId: req.user._id}).then(async (data)=>{
    if(data){
      savedData = JSON.parse(JSON.stringify(data));
    }
  });
  var input = {
    data: req.body.data,
    inputAt: new Date(),
  }
  switch (req.body.type) {
    case 0:
      savedData.bloodData.push(input);
      break;
    case 1:
      savedData.weightData.push(input);
      break;
    case 2:
      savedData.insulinData.push(input);
      break;
    default:
      savedData.exerciseData.push(input);
      break;
  }
  let id = savedData._id;
  delete savedData._id;
  // Now update data
  await UserData.findByIdAndUpdate(id, { $set: savedData }).then((updatedData)=>{
    if(updatedData){
      res.status(200).send(updatedData);
    }
  })
  // Case of error
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: 'Error when updating Data!',
      });
    });
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