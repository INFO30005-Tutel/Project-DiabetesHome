const handlebars = require('handlebars');
const UserDataController = require('./user-data');
const HelperController = require('./helper');
const User = require('../models/user');
const UserController = require('./user');

const renderClinicianDashboard = async (req, res) => {
  const clinicianId = req.user._id;
  const clinicianName = req.user.firstName + ' ' + req.user.lastName;
  const dateAndTime = HelperController.getDateAndTime();

  res.render('clinician/dashboard.hbs', {
    layout: 'clinician-layout.hbs',
    tableData: await getTableData(clinicianId),
    clinicianName: clinicianName,
    date: dateAndTime.date,
    time: dateAndTime.time,
  });
};

const renderPatientProfile = async (req, res) => {
  const patId = req.params.patId;
  const patDefaultInfo = UserController.getPatientDefaultInfo(patId);
  const thresholds = UserDataController.getThresholds(patId);
  const todayData = await UserDataController.getTodayData(patId);
  // const overViewData = ;
  // const detailedData = ;

  res.render('clinician/patient-profile.hbs', {
    layout: 'clinician-layout.hbs',
    patDefaultInfo: patDefaultInfo, //[email, firstName, lastName, dateOfBirth, phoneNumber]
    thresholds: thresholds,
    todayData: todayData,
    // overviewData: overviewData,
    // detailedData: detailedData,
  });
};

const renderRegisterPatient = async (req, res) => {
  const clinicianName = req.user.firstName + ' ' + req.user.lastName;

  res.render('clinician/register-patient.hbs', {
    layout: 'clinician-layout.hbs',
    clinicianName: clinicianName,
  });
};

const getPatientsOfClinician = async (clinicianId) => {
  let patientList = User.find({ clinicianId: clinicianId }).lean();
  return patientList;
};

// blood, weight, insulin, stepcount
const defaultDangerThreshold = [3.9, 5.6, 80, 100, 0, 2, 1000, 4000];

const getTableData = async (clinicianId) => {
  let patientList;
  let data;

  try {
    patientList = await getPatientsOfClinician(clinicianId);
  } catch (err) {
    console.log(err);
  }
  for (patient of patientList) {
    // Patient is a combined object of User and UserData
    try {
      //console.log(patient);
      data = await UserDataController.getTodayData(patient._id);
    } catch (err) {
      console.log(err);
    }

    // Add `required` value to fields that patient need to update
    patient.bloodGlucose = data.bloodGlucoseData || {};
    patient.bloodGlucose.lowThresh = data.bloodGlucoseLowThresh || defaultDangerThreshold[0];
    patient.bloodGlucose.highThresh = data.bloodGlucoseHighThresh || defaultDangerThreshold[1];
    if (data.requiredFields.includes(0)) patient.bloodGlucose.required = true;

    patient.weight = data.weightData || {};
    patient.weight.lowThresh = data.weightLowThresh || defaultDangerThreshold[2];
    patient.weight.highThresh = data.weightHighThresh || defaultDangerThreshold[3];
    if (data.requiredFields.includes(1)) patient.weight.required = true;

    patient.insulinDose = data.insulinDoseData || {};
    patient.insulinDose.lowThresh = data.insulinDoseLowThresh || defaultDangerThreshold[4];
    patient.insulinDose.highThresh = data.insulinDoseHighThresh || defaultDangerThreshold[5];
    if (data.requiredFields.includes(2)) patient.insulinDose.required = true;

    patient.stepCount = data.stepCountData || {};
    patient.stepCount.lowThresh = data.stepCountLowThresh || defaultDangerThreshold[6];
    patient.stepCount.highThresh = data.stepCountHighThresh || defaultDangerThreshold[7];
    if (data.requiredFields.includes(3)) patient.stepCount.required = true;
  }

  return patientList;
};

const getTextColor = (value, lowThresh, highThresh, type) => {
  const ok = '#2b7a3d';
  const unknown = '#9b7509';
  const warning = '#b42424';

  switch (type) {
    case 'bloodGlucose':
      if (!value) return unknown;
      else if (value < lowThresh || value > highThresh) return warning;
      else return ok;
    case 'weight':
      if (!value) return unknown;
      else if (value < lowThresh || value > highThresh) return warning;
      else return ok;
    case 'insulinDose':
      if (!value) return unknown;
      else if (value < lowThresh || value > highThresh) return warning;
      else return ok;
    case 'stepCount':
      if (!value) return unknown;
      else if (value < lowThresh || value > highThresh) return warning;
      else return ok;
  }
};

const getIcon = (patient) => {
  const ok = 'fa-check-circle';
  const unknown = 'fa-question-circle';
  const warning = 'fa-exclamation-circle';

  let hasUnknown = false;
  let hasWarning = false;

  if (patient.bloodGlucose.required) {
    let bg = patient.bloodGlucose;
    if (!bg.value) hasUnknown = true;
    else if (bg.value < bg.lowThresh || bg.value > bg.highThresh) hasWarning = true;
  }
  if (patient.weight.required) {
    let w = patient.weight;
    if (!w.value) hasUnknown = true;
    else if (w.value < w.lowThresh || w.value > w.highThresh) hasWarning = true;
  }
  if (patient.insulinDose.required) {
    let dose = patient.insulinDose; // use `id` shorthand may lead to confusion
    if (!dose.value) hasUnknown = true;
    else if (dose.value < dose.lowThresh || dose.value > dose.highThresh) hasWarning = true;
  }
  if (patient.stepCount.required) {
    let sc = patient.stepCount;
    if (!sc.value) hasUnknown = true;
    else if (sc.value < sc.lowThresh || sc.value > sc.highThresh) hasWarning = true;
  }
  if (hasWarning) return warning;
  if (hasUnknown) return unknown;
  return ok;
};

const getIconColor = (patient) => {
  const ok = '#2b7a3d';
  const unknown = '#9b7509';
  const warning = '#b42424';

  let hasUnknown = false;
  let hasWarning = false;

  if (patient.bloodGlucose.required) {
    let bg = patient.bloodGlucose;
    if (!bg.value) hasUnknown = true;
    else if (bg.value < bg.lowThresh || bg.value > bg.highThresh) hasWarning = true;
  }
  if (patient.weight.required) {
    let w = patient.weight;
    if (!w.value) hasUnknown = true;
    else if (w.value < w.lowThresh || w.value > w.highThresh) hasWarning = true;
  }
  if (patient.insulinDose.required) {
    let dose = patient.insulinDose; // use `id` shorthand may lead to confusion
    if (!dose.value) hasUnknown = true;
    else if (dose.value < dose.lowThresh || dose.value > dose.highThresh) hasWarning = true;
  }
  if (patient.stepCount.required) {
    let sc = patient.stepCount;
    if (!sc.value) hasUnknown = true;
    else if (sc.value < sc.lowThresh || sc.value > sc.highThresh) hasWarning = true;
  }
  console.log('GetIcon');
  console.log(hasWarning);
  console.log(hasUnknown);

  if (hasWarning) return warning;
  if (hasUnknown) return unknown;
  return ok;
};

handlebars.registerHelper('getTextColor', getTextColor);
handlebars.registerHelper('getIcon', getIcon);
handlebars.registerHelper('getIconColor', getIconColor);

module.exports = {
  renderClinicianDashboard,
  renderPatientProfile,
  renderRegisterPatient,
};
