const handlebars = require('handlebars');
const controller = require('./delivery2-mock');
const helper = require('./helper');

const mockPatientId = '6267f02b41463408a4205299';
const mockClinicianId = '6267ec216e7d25b724cac71d';

// handle dashboard data
const getDashboardData = async (req, res) => {
  //const clinicianId = req.params.clinician_id;
  const clinicianName = 'Chris Smith';
  const dateAndTime = helper.getDateAndTime();
  console.log(await getTableData(mockClinicianId));

  res.render('clinician/dashboard.hbs', {
    layout: 'clinician-layout.hbs',
    tableData: await getTableData(mockClinicianId),
    clinicianName: clinicianName,
    date: dateAndTime.date,
    time: dateAndTime.time,
  });
};

const getPatientData = async (req, res) => {
  //const patientId = req.params.pat_id;
  const patientName = 'John Doe';
  const patinetEmail = 'jdoee@gmail.com';
  const patientPhoneNo = '0123456789';
  const patientDob = '27/2/1980';
  const recordingTime = {
    from: '14:00',
    to: '16:00',
  }

  // handlebars.registerPartial('patient-default-info', '{{defaultInfo}}');

  res.render('clinician/patient-profile.hbs', {
    layout: 'clinician-layout.hbs',
    tableData: await getTableData(mockClinicianId),
    patientName: patientName,
    patinetEmail: patinetEmail,
    patientPhoneNo: patientPhoneNo,
    recordingTime: recordingTime,
    patientDob: patientDob,
    thresholds: [
      { thresName: 'Blood glucose level', thresFrom: 110, thresTo: 130, thresUnit: 'nmol/L', thresTime: 'Morning' },
      { thresName: 'Weight entry', thresFrom: 70, thresTo: 90, thresUnit: 'kg', thresTime: 'Morning' },
      { thresName: 'Dose of insulin taken per day', thresFrom: 2, thresTo: 3, thresUnit: 'doses', thresTime: 'Afternoon' },
      { thresName: 'Step count recommended', thresFrom: 4000, thresTo: 6000, thresUnit: 'steps', thresTime: 'Evening' },
    ]
  });
};

// blood, weight, insulin, stepcount
const dangerThreshold = [6000, 8000, 80, 100, 0, 2, 1000, 4000];

const getTableData = async (clinicianId) => {
  let patientList;
  let patientData;

  try {
    patientList = await controller.getPatientsOfClinician(clinicianId);
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
  console.log(type);
  console.log(value);

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
  getDashboardData,
  getPatientData,
};
