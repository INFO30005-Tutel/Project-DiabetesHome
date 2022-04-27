const handlebars = require('handlebars');
const UserData = require('../models/user-data');
const User = require('../models/user');
const helper = require('./helper');

const mockPatientId = '6267f02b41463408a4205299';
const mockClinicianId = '6267ec216e7d25b724cac71d';

// handle dashboard data
const getDashboardData = async (req, res) => {
  const clinicianId = req.params.clinician_id;
  const clinicianName = 'Chris Smith';
  const dateAndTime = getDateAndTime();
  console.log('clinician_id is ', clinicianId);
  console.log(await getTableData(clinicianId));

  res.render('clinician/dashboard.hbs', {
    layout: 'clinician-layout.hbs',
    tableData: await getTableData(clinicianId),
    clinicianName: clinicianName,
    date: dateAndTime.date,
    time: dateAndTime.time,
  });
};

// blood, weight, insulin, stepcount
const dangerThreshold = [3, 6, 80, 100, 0, 2, 1000, 4000];

const examplePatientData = [
  {
    id: 'placeholder_id_1',
    name: 'John Doe',
    status: 'ok',
    blood_glucose: {
      status: null,
      value: 135,
    },
    weight: {
      status: null,
      value: 91,
    },
    insulin_doses: {
      status: null,
      value: null,
    },
    step_counts: {
      status: null,
      value: 5000,
    },
  },
  {
    id: 'placeholder_id_2',
    name: 'Jack Smith',
    status: 'warning',
    blood_glucose: {
      status: 'warning',
      value: 221,
    },
    weight: {
      status: null,
      value: 72,
    },
    insulin_doses: {
      status: null,
      value: null,
    },
    step_counts: {
      status: null,
      value: 10000,
    },
  },
  {
    id: 'placeholder_id_3',
    name: 'Adam Jerry',
    status: 'unknown',
    blood_glucose: {
      status: 'unknown',
      value: null,
    },
    weight: {
      status: 'unknown',
      value: null,
    },
    insulinDoses: {
      status: 'unknown',
      value: null,
    },
    stepCounts: {
      status: null,
      value: 500,
    },
  },
];

const getTableData = async (clinicianId) => {
  let patientList;
  let patientData;

  try {
    patientList = await User.find({ clinicianId: mockClinicianId }).lean();
  } catch (err) {
    console.log(err);
  }
  for (patient of patientList) {
    try {
      patientData = await UserData.findOne({ userId: patient._id }).lean();
      patientData.bloodData = await helper.retrieveTodayData(
        patientData.bloodData
      );
      patientData.weightData = await helper.retrieveTodayData(
        patientData.weightData
      );
      patientData.insulinData = await helper.retrieveTodayData(
        patientData.insulinData
      );
      patientData.exerciseData = await helper.retrieveTodayData(
        patientData.exerciseData
      );
    } catch (err) {
      console.log(err);
    }
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

const getDateAndTime = () => {
  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
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
  var today = new Date();
  var time =
    today.getHours() +
    ':' +
    today.getMinutes() +
    ' ' +
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  var date =
    days[today.getDay()] +
    ', ' +
    today.getDate() +
    ' ' +
    months[today.getMonth()] +
    ' ' +
    today.getFullYear();
  return {
    time,
    date,
  };
};

const getColour = (value, type) => {
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

const isRequired = (requiredFields, type) => {
  if (requiredFields.includes(type)) {
    return true;
  }
  return false;
};

handlebars.registerHelper('getColour', getColour);
handlebars.registerHelper('getIcon', getIcon);
handlebars.registerHelper('isRequired', isRequired);

module.exports = {
  getDashboardData,
};
