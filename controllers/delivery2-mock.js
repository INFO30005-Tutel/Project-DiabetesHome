const UserData = require('../models/user-data');
const User = require('../models/user');
const helper = require('./helper');

const mockPatientId = '6267f02b41463408a4205299';
const mockClinicianId = '6267ec216e7d25b724cac71d';

exports.mockLogin = (req, res) => {
  const { email, password } = req.body;
  console.warn('SIGN IN NOT IMPLEMENTED');
  console.debug('login email: ', email, ', password: ', password);
  const isPatient = true;
  if (isPatient) {
    res.redirect('/patient-main-dashboard');
  } else {
    res.redirect('/cli/1');
  }
};

exports.mockSignUp = (req, res) => {
  console.warn('SIGN UP NOT IMPLEMENTED');
  res.redirect('/cli/1');
};

exports.mockUpdate = async (req, res) => {
  let savedData;
  await UserData.findOne({ userId: mockPatientId }).then(async (data) => {
    if (data) {
      savedData = JSON.parse(JSON.stringify(data));
    }
  });
  var input = {
    data: req.body.data,
    note: req.body.note,
    inputAt: new Date(),
  };
  if (req.body.type == 0) savedData.bloodData.push(input);
  if (req.body.type == 1) savedData.weightData.push(input);
  if (req.body.type == 2) savedData.insulinData.push(input);
  if (req.body.type == 3) savedData.exerciseData.push(input);

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

exports.mockGetTodayData = (req, res) => {
  var toReturn = {};
  UserData.findOne({ userId: mockPatientId })
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

exports.mockGetPatients = async (req, res) => {
  User.find({ clinicianId: mockClinicianId })
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error accessing the database!' });
    });
};
