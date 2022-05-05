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
    const endpoint = '/patient/' + mockPatientId;
    res.redirect(endpoint);
  } else {
    const endpoint = '/clinician/' + mockClinicianId;
    res.redirect(endpoint);
  }
};

exports.mockSignUp = (req, res) => {
  console.warn('SIGN UP NOT IMPLEMENTED');
  const endpoint = '/clinician/' + mockClinicianId;
  res.redirect(endpoint);
};

exports.mockUpdate = async (req, res) => {
  let savedData;
  await UserData.findOne({ userId: mockPatientId }).then(async (data) => {
    if (data) {
      savedData = JSON.parse(JSON.stringify(data));
    }
  });

  let input = {
    data: req.body.data,
    note: req.body.note,
    inputAt: new Date(),
  };
  let now = new Date();
  let todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let last;
  if (req.body.type == 0) {
    last = savedData.bloodData[savedData.bloodData.length - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.bloodData[savedData.bloodData.length - 1] = input;
    } else {
      savedData.bloodData.push(input);
    }
  }
  if (req.body.type == 1) {
    last = savedData.bloodData[savedData.weightData.length - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.weightData[savedData.weightData.length - 1] = input;
    } else {
      savedData.weightData.push(input);
    }
  }
  if (req.body.type == 2) {
    last = savedData.bloodData[savedData.insulinData.length - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.insulinData[savedData.insulinData.length - 1] = input;
    } else {
      savedData.insulinData.push(input);
    }
  }
  if (req.body.type == 3) {
    last = savedData.bloodData[savedData.exerciseData.length - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.exerciseData[savedData.exerciseData.length - 1] = input;
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
        res.redirect(`patient/${savedData.userId}`);
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

exports.getTodayData = async (patientId) => {
  let patientData = await UserData.findOne({ userId: patientId }).lean();

  patientData.bloodData = await helper.retrieveTodayData(patientData.bloodData);
  patientData.weightData = await helper.retrieveTodayData(
    patientData.weightData
  );
  patientData.insulinData = await helper.retrieveTodayData(
    patientData.insulinData
  );
  patientData.exerciseData = await helper.retrieveTodayData(
    patientData.exerciseData
  );

  return patientData;
};

exports.getPatientHasData = async (patientID) => {
  let patientData = await UserData.findOne({ userId: patientID }).lean();

  let hasData = [];

  hasData.push(patientData.bloodData.length > 0);
  hasData.push(patientData.weightData.length > 0);
  hasData.push(patientData.insulinData.length > 0);
  hasData.push(patientData.exerciseData.length > 0);

  return hasData;
};

exports.getPatientsOfClinician = async (clinicianId) => {
  let patientList = User.find({ clinicianId: clinicianId }).lean();
  return patientList;
};

exports.getUser = async (userId) => {
  let user = User.findById(userId).lean();
  return user;
};
