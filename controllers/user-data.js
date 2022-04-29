// Controller to perform CRUD on UserData parameter
const { type } = require('express/lib/response');
const UserData = require('../models/user-data');
const helper = require('./helper');

// {
//   type: int (type index),
//   data: double/float/number
// }
exports.update = async (req, res) => {
  console.log(req.body);
  let savedData;
  await UserData.findOne({ userId: req.user._id }).then(async (data) => {
    if (data) {
      savedData = JSON.parse(JSON.stringify(data));
    }
  });
  var input = {
    data: req.body.data,
    note: req.body.note,
    inputAt: new Date(),
  };

  let now = new Date();
  let todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let last;
  if (req.body.type == 0) {
    last = savedData.bloodData[savedData.bloodData.length-1]
    if (last && new Date(last.inputAt).getTime()>todayDate.getTime()) {
      // Override last entry
      savedData.bloodData[savedData.bloodData.length-1] = input;
    } else {
      savedData.bloodData.push(input);
    }
  }
  if (req.body.type == 1) {
    last = savedData.bloodData[savedData.weightData.length-1]
    if (last && new Date(last.inputAt).getTime()>todayDate.getTime()) {
      // Override last entry
      savedData.weightData[savedData.weightData.length-1] = input;
    } else {
      savedData.weightData.push(input);
    }
  }
  if (req.body.type == 2) {
    last = savedData.bloodData[savedData.insulinData.length-1]
    if (last && new Date(last.inputAt).getTime()>todayDate.getTime()) {
      // Override last entry
      savedData.insulinData[savedData.insulinData.length-1] = input;
    } else {
      savedData.insulinData.push(input);
    }
  }
  if (req.body.type == 3) {
    last = savedData.bloodData[savedData.exerciseData.length-1]
    if (last && new Date(last.inputAt).getTime()>todayDate.getTime()) {
      // Override last entry
      savedData.exerciseData[savedData.exerciseData.length-1] = input;
    } else {
      savedData.exerciseData.push(input);
    }
  }

  let id = savedData._id;
  delete savedData._id;
  // Now update data
  await UserData.findByIdAndUpdate(id, { $set: savedData })
    .then((updatedData) => {
      if (updatedData) {
        res.status(200).send({ message: 'Update data successfully!' });
      }
    })
    // Case of error
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: 'Error when updating Data!',
      });
    });
};

exports.getTodayData = (req, res) => {
  var toReturn = {};
  UserData.findOne({ userId: req.user._id })
    .then(async (dataBlock) => {
      if (!dataBlock) {
        res.status(404).send({ message: 'Missing user-data for this user!' });
      }
      console.log(dataBlock);
      // Get access to each of data elements
      toReturn.bloodData = await helper.retrieveTodayData(dataBlock.bloodData);
      toReturn.weightData = await helper.retrieveTodayData(
        dataBlock.weightData
      );
      toReturn.insulinData = await helper.retrieveTodayData(
        dataBlock.insulinData
      );
      toReturn.exerciseData = await helper.retrieveTodayData(
        dataBlock.exerciseData
      );

      res.status(200).send(toReturn);
    })
    // Case of error
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: 'Error when getting Data!',
      });
    });
};

exports.getDataDuring = async (req, res) => {
  const from = new Date(req.body.from);
  const to = new Date(req.body.to);
  to.setHours(23, 59, 59, 999);

  var toReturn = [];

  await UserData.findOne({ userId: req.user._id })
    .then(async (dataBlock) => {
      if (!dataBlock) {
        res.status(404).send({ message: 'Missing user-data for this user!' });
      }

      var dataArray = [];
      switch (req.body.type) {
        case 0:
          dataArray = dataBlock.bloodData;
          break;
        case 1:
          dataArray = dataBlock.weightData;
          break;
        case 2:
          dataArray = dataBlock.insulinData;
          break;
        default:
          dataArray = dataBlock.exerciseData;
          break;
      }

      dataArray.forEach((element) => {
        if (element.inputAt > from && element.inputAt < to) {
          toReturn.push(element);
        }
      });

      res.status(200).send(toReturn);
    })
    // Case of error
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: 'Error when getting Data!',
      });
    });
};

// Debugging methods
exports.findOne = (req, res) => {
  helper.findData(UserData, req, res);
};
exports.findAll = (req, res) => {
  helper.findAllData(UserData, req, res);
};
