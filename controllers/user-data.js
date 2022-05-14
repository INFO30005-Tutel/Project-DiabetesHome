const UserData = require('../models/user-data');
const helper = require('../controllers/helper');

const getTodayData = async (patientId) => {
  let patientData = await UserData.findOne({ userId: patientId }).lean();
  //console.log(patientData);

  patientData.bloodGlucoseData = await helper.retrieveTodayData(patientData.bloodGlucoseData);
  patientData.weightData = await helper.retrieveTodayData(patientData.weightData);
  patientData.insulinDoseData = await helper.retrieveTodayData(patientData.insulinDoseData);
  patientData.stepCountData = await helper.retrieveTodayData(patientData.stepCountData);

  return patientData;
};

const updateUserDataMeasurement = async (req, res) => {
  let savedData;
  await UserData.findOne({ userId: req.user._id }).then(async (data) => {
    if (data) {
      savedData = JSON.parse(JSON.stringify(data));
    }
  });

  let input = {
    value: req.body.value,
    note: req.body.note,
    inputAt: new Date(),
  };
  let now = new Date();
  let todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let last;
  let n;
  if (req.body.type == 0) {
    n = savedData.bloodGlucoseData.length;
    last = savedData.bloodGlucoseData[n - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.bloodGlucoseData[n - 1] = input;
    } else {
      savedData.bloodGlucoseData.push(input);
    }
  }
  if (req.body.type == 1) {
    n = savedData.weightData.length;
    last = savedData.weightData[n - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.weightData[n - 1] = input;
    } else {
      savedData.weightData.push(input);
    }
  }
  if (req.body.type == 2) {
    n = savedData.insulinDoseData.length;
    last = savedData.insulinDoseData[n - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.insulinDoseData[n - 1] = input;
    } else {
      savedData.insulinDoseData.push(input);
    }
  }
  if (req.body.type == 3) {
    n = savedData.stepCountData.length;
    last = savedData.stepCountData[n - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.stepCountData[n - 1] = input;
    } else {
      savedData.stepCountData.push(input);
    }
  }

  let id = savedData._id;
  delete savedData._id;
  // Now update data
  await UserData.findByIdAndUpdate(id, { $set: savedData })
    .then((updatedData) => {
      if (updatedData) {
        res.redirect(`/patient`);
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

// Change what measurement patient need to record, along with their threshold
const changePatientRecordParameter = async (req, res) => {
  let patientData;
  try {
    patientData = await UserData.findOne({ userId: req.params.id }).lean();
  } catch (err) {
    console.log(err);
  }
  try {
    patientData = await UserData.findByIdAndUpdate(
      patientData._id,
      { $set: req.body },
      { new: true }
    ).lean();
  } catch (err) {
    console.log(err);
  }

  // Remove unneccessary fields
  delete patientData.bloodGlucoseData;
  delete patientData.weightData;
  delete patientData.insulinDoseData;
  delete patientData.stepCountData;

  return patientData;
};

// blood, weight, insulin, stepcount
const defaultLowBlood = 3.9;
const defaultHighBlood = 5.6;
const defaultLowWeight = 80;
const defaultHighWeight = 100;
const defaultLowInsulin = 0;
const defaultHighInsulin = 2;
const defaultLowStep = 1000;
const defaultHighStep = 4000;
// Rechieve and format threshold for rendering
const getThresholds = async (patId) => {
  let patientData = await UserData.findOne({ userId: patId }).lean();

  const bloodThres = helper.formatThreshold(
    'Blood glucose level',
    patientData.bloodGlucoseLowThresh,
    patientData.bloodGlucoseHighThresh,
    'mmol/L',
    defaultLowBlood,
    defaultHighBlood,
  );

  const weightThres = helper.formatThreshold(
    'Weight entry',
    patientData.weightLowThresh,
    patientData.weightHighThresh,
    'kg',
    defaultLowWeight,
    defaultHighWeight,
  );

  const insulinThres = helper.formatThreshold(
    'Dose of insulin taken per day',
    patientData.insulinDoseLowThresh,
    patientData.insulinDoseHighThresh,
    'doses',
    defaultLowInsulin,
    defaultHighInsulin,
  );

  const stepCountThres = helper.formatThreshold(
    'Step count recommended',
    patientData.stepCountLowThresh,
    patientData.stepCountHighThresh,
    'steps',
    defaultLowStep,
    defaultHighStep,
  );

  return [bloodThres, weightThres, insulinThres, stepCountThres];
};

const getOverviewData = async (patId) => {

};

const getDetailedData = async (patId) => {

};

module.exports = {
  getTodayData,
  updateUserDataMeasurement,
  changePatientRecordParameter,
  getThresholds,
  getDetailedData,
  getOverviewData,
};
