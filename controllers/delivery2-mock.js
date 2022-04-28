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

exports.getTodayData = async (id) => {
  let patientData = await UserData.findOne({ userId: patient._id }).lean();

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

exports.getPatients = async (clinicianId) => {
  let patientList = User.find({ clinicianId: clinicianId }).lean();
  return patientList;
};
