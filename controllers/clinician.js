const handlebars = require('handlebars');
const { create } = require('express-handlebars');
const UserDataController = require('./user-data');
const HelperController = require('./helper');
const NoteController = require('./notes');
const MessageController = require('./messages');
const User = require('../models/user');
const UserController = require('./user');

const hbs = create({
  helpers: {
    formateDateTime(input) {
      HelperController.formatDateTime(input);
    },
  },
});
const textSize = [20, 24, 28, 30, 36, 48];
const textStyle = [
  'Arial',
  'Times New Roman',
  'Times',
  'Courier New',
  'Courier',
  'Verdana',
  'Georgia',
  'Palantino',
  'Garamond',
  'Bookman',
  'Tahoma',
  'Trebuchet MS',
  'Arial Black',
  'Comic Sans Ms',
  'Impact',
];
const renderNotes = async (req, res) => {
  const patId = req.params.patId;
  const patient = await User.findById(patId);
  if (!patient.clinicianId.equals(req.user._id)) {
    res.status(403).send("Unauthorised to access this patient");
    return;
  }
  const notes = await NoteController.getNotes(patId);

  res.render('clinician/patient-notes.hbs', {
    layout: 'clinician-layout.hbs',
    data: notes,
    patId: patId,
    textSize: textSize,
    textStyle: textStyle,
    patId: patId,
  });
};
const renderMessages = async (req, res) => {
  const patId = req.params.patId;
  const patient = await User.findById(patId);
  if (!patient.clinicianId.equals(req.user._id)) {
    res.status(403).send("Unauthorised to access this patient");
    return;
  }
  const messages = await MessageController.getMessages(patId);
  res.render('clinician/patient-messages.hbs', {
    layout: 'clinician-layout.hbs',
    data: messages,
    patId: patId,
    textSize: textSize,
    textStyle: textStyle,
    patId: patId,
  });
};

// blood, weight, insulin, stepcount
const defaultDangerThreshold = [3.9, 5.6, 60, 120, 0, 5, 1000, 20000];

const renderClinicianDashboard = async (req, res) => {
  const clinicianId = req.user._id;
  const clinicianName = req.user.firstName + ' ' + req.user.lastName;
  const dateAndTime = HelperController.getDateAndTime(new Date());
  const tableData = await getTableData(clinicianId);
  res.render('clinician/dashboard.hbs', {
    layout: 'clinician-layout.hbs',
    tableData: tableData,
    clinicianName: clinicianName,
    date: dateAndTime.date,
    weekDay: dateAndTime.weekDay,
    time: dateAndTime.time,
    numPatient: tableData.length,
  });
};

const renderPatientProfile = async (req, res) => {
  const patId = req.params.patId;
  const patient = await User.findById(patId);
  if (!patient.clinicianId.equals(req.user._id)) {
    res.status(403).send("Unauthorised to access this patient");
    return;
  }
  const patPersonalInfo = await UserController.getPersonalInfo(patId);
  const formatDob = HelperController.getDateAndTime(patPersonalInfo.dateOfBirth);
  const thresholds = await UserDataController.getThresholds(patId, defaultDangerThreshold);
  const patientRawData = await getThisPatientOfClinician(req.user._id, patId);
  let todayData = await dataRow(patientRawData);
  const overViewData = await UserDataController.getOverviewData(patId);
  const detailedData = await UserDataController.getDetailedData(patId);
  const userDataId = await HelperController.getUserDataId(patientRawData._id);

  res.render('clinician/patient-profile.hbs', {
    layout: 'clinician-layout.hbs',
    patPersonalInfo: patPersonalInfo, //[email, firstName, lastName, phoneNumber]
    formatDob: formatDob,
    thresholds: thresholds,
    todayData: todayData,
    overviewData: overViewData,
    detailedData: detailedData,
    userdataId: userDataId,
  });
};

const renderRegisterPatient = async (req, res) => {
  const clinicianName = req.user.firstName + ' ' + req.user.lastName;

  res.render('clinician/register-patient.hbs', {
    layout: 'clinician-layout.hbs',
    defaultThresh: defaultDangerThreshold,
    clinicianName: clinicianName,
  });
};

const renderSetting = async (req, res) => {
  const personalInfo = await UserController.getPersonalInfo(req.user._id);
  personalInfo.dateOfBirth = personalInfo.dateOfBirth.toISOString().substr(0, 10);

  res.render('shared/setting.hbs', {
    layout: 'clinician-layout.hbs',
    isPatient: false,
    personalInfo: personalInfo,
  });
};

const getPatientsOfClinician = async (clinicianId) => {
  let patientList = User.find({ clinicianId: clinicianId }).lean();
  return patientList;
};

const getThisPatientOfClinician = async (clinicianId, patId) => {
  let patient = User.findOne({ clinicianId: clinicianId, _id: patId }).lean();
  return patient;
};

const formatPatientRegister = async (req, res, next) => {
  let requiredFields = [];
  req.body.clinicianId = req.user._id;
  if (req.body.bloodGlucoseCheckbox) requiredFields.push(0);
  if (req.body.weightCheckbox) requiredFields.push(1);
  if (req.body.insulinDoseCheckbox) requiredFields.push(2);
  if (req.body.stepCountCheckbox) requiredFields.push(3);
  req.body.requiredFields = requiredFields;
  //console.log(req.body);
  next();
};

const getTableData = async (clinicianId) => {
  let patientList;

  try {
    patientList = await getPatientsOfClinician(clinicianId);
  } catch (err) {
    console.log(err);
  }
  for (patient of patientList) {
    patient = await dataRow(patient);
  }

  return patientList;
};

const dataRow = async (patient) => {
  let data;
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

  return patient;
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

  if (hasWarning) return warning;
  if (hasUnknown) return unknown;
  return ok;
};

var formatDateTime = (inputDT) => {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  
  var minute = inputDT.getMinutes().toString().length < 2 ? "0" + inputDT.getMinutes() : inputDT.getMinutes(); 
  var time = inputDT.getHours() + ':' + minute;

  var date = inputDT.getDate() + ' ' + months[inputDT.getMonth()] + ' ' + inputDT.getFullYear();
  var result = time.toString() + ' ' + date.toString();
  return result;
};

handlebars.registerHelper('getTextColor', getTextColor);
handlebars.registerHelper('getIcon', getIcon);
handlebars.registerHelper('getIconColor', getIconColor);
handlebars.registerHelper('json', (obj) => {
  return JSON.stringify(obj);
});
handlebars.registerHelper('formatDateTime', formatDateTime);

module.exports = {
  renderClinicianDashboard,
  renderPatientProfile,
  renderRegisterPatient,
  renderSetting,
  formatPatientRegister,
  renderMessages,
  renderNotes,
  formatDateTime,
};
