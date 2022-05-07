const handlebars = require('handlebars');
const controller = require('./user-data');
const helper = require('./helper');
const User = require('../models/user');

const renderClinicianDashboard = async (req, res) => {
  console.log('READ DATAAAAAAAAA');
  console.log(req.user);
  const clinicianId = req.user._id;
  const clinicianName = req.user.firstName + ' ' + req.user.lastName;
  const dateAndTime = helper.getDateAndTime();

  res.render('clinician/dashboard.hbs', {
    layout: 'clinician-layout.hbs',
    tableData: await getTableData(clinicianId),
    clinicianName: clinicianName,
    date: dateAndTime.date,
    time: dateAndTime.time,
  });
};

const getPatientsOfClinician = async (clinicianId) => {
  let patientList = User.find({ clinicianId: clinicianId }).lean();
  return patientList;
};

// blood, weight, insulin, stepcount
const dangerThreshold = [6000, 8000, 80, 100, 0, 2, 1000, 4000];

const getTableData = async (clinicianId) => {
  let patientList;
  let patientData;

  try {
    patientList = await getPatientsOfClinician(clinicianId);
  } catch (err) {
    console.log(err);
  }
  for (patient of patientList) {
    try {
      patientData = await controller.getTodayData(patient._id);
    } catch (err) {
      console.log(err);
    }

    // Add `required` value to fields that patient need to update
    patient.bloodGlucose = patientData.bloodData || {};
    if (patient.requiredFields.includes(0))
      patient.bloodGlucose.required = true;
    patient.weight = patientData.weightData || {};
    if (patient.requiredFields.includes(1)) patient.weight.required = true;
    patient.insulinDoses = patientData.insulinData || {};
    if (patient.requiredFields.includes(2))
      patient.insulinDoses.required = true;
    patient.stepCounts = patientData.exerciseData || {};
    if (patient.requiredFields.includes(3)) patient.stepCounts.required = true;
  }

  return patientList;
};

const getTextColor = (value, type) => {
  const ok = '#2b7a3d';
  const unknown = '#9b7509';
  const warning = '#b42424';

  switch (type) {
    case 'bloodGlucose':
      if (!value) return unknown;
      else if (value < dangerThreshold[0] || value > dangerThreshold[1])
        return warning;
      else return ok;
    case 'weight':
      if (!value) return unknown;
      else if (value < dangerThreshold[2] || value > dangerThreshold[3])
        return warning;
      else return ok;
    case 'insulinDoses':
      if (!value) return unknown;
      else if (value < dangerThreshold[4] || value > dangerThreshold[5])
        return warning;
      else return ok;
    case 'stepCounts':
      if (!value) return unknown;
      else if (value < dangerThreshold[4] || value > dangerThreshold[5])
        return warning;
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
    let value = patient.bloodGlucose.data;
    if (!value) hasUnknown = true;
    else if (value < dangerThreshold[0] || value > dangerThreshold[1])
      hasWarning = true;
  }
  if (patient.weight.required) {
    let value = patient.weight.data;
    if (!value) hasUnknown = true;
    else if (value < dangerThreshold[2] || value > dangerThreshold[3])
      hasWarning = true;
  }
  if (patient.insulinDoses.required) {
    let value = patient.insulinDoses.data;
    if (!value) hasUnknown = true;
    else if (value < dangerThreshold[4] || value > dangerThreshold[5])
      hasWarning = true;
  }
  if (patient.stepCounts.required) {
    let value = patient.stepCounts.data;
    if (!value) hasUnknown = true;
    else if (value < dangerThreshold[6] || value > dangerThreshold[7])
      hasWarning = true;
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
    let value = patient.bloodGlucose.data;
    if (!value) hasUnknown = true;
    else if (value < dangerThreshold[0] || value > dangerThreshold[1])
      hasWarning = true;
  }
  if (patient.weight.required) {
    let value = patient.weight.data;
    if (!value) hasUnknown = true;
    else if (value < dangerThreshold[2] || value > dangerThreshold[3])
      hasWarning = true;
  }
  if (patient.insulinDoses.required) {
    let value = patient.insulinDoses.data;
    if (!value) hasUnknown = true;
    else if (value < dangerThreshold[4] || value > dangerThreshold[5])
      hasWarning = true;
  }
  if (patient.stepCounts.required) {
    let value = patient.stepCounts.data;
    if (!value) hasUnknown = true;
    else if (value < dangerThreshold[6] || value > dangerThreshold[7])
      hasWarning = true;
  }
  if (hasWarning) return warning;
  if (hasUnknown) return unknown;
  return ok;
};

handlebars.registerHelper('getTextColor', getTextColor);
handlebars.registerHelper('getIcon', getIcon);
handlebars.registerHelper('getIconColor', getIconColor);

module.exports = {
  renderClinicianDashboard,
};
