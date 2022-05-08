const handlebars = require('handlebars');
const userDataController = require('./user-data');
const helperController = require('./helper');
const UserData = require('../models/user-data');

const patientMetadata = [
  {
    name: 'Blood Glucose',
    units: 'nmol/L',
    shortName: 'glucose',
    iconImage: '/images/blood-glucose.svg',
  },
  {
    name: 'Weight',
    units: 'kg',
    shortName: 'weight',
    iconImage: '/images/weight.svg',
  },
  {
    name: 'Insulin Doses',
    units: 'doses',
    shortName: 'insulin',
    iconImage: '/images/insulin.svg',
  },
  {
    name: 'Exercise',
    units: 'steps',
    shortName: 'exercise',
    iconImage: '/images/exercise.svg',
  },
];

// handle dashboard data
const renderPatientDashboard = async (req, res) => {
  const patient = req.user;
  const dateAndTime = helperController.getDateAndTime();
  res.render('patient/patient-dashboard.hbs', {
    layout: 'patient-layout.hbs',
    userId: patient._id,
    // Not normal UserData, but a combined User and UserData
    userData: await getPatientData(patient),
    metadata: patientMetadata,
    date: dateAndTime.date,
    time: dateAndTime.time,
  });
};

const getPatientData = async (patientUser) => {
  // Clone the patient's User object
  let patient = JSON.parse(JSON.stringify(patientUser));
  let patientUserData;
  let patientHasData;

  try {
    patientUserData = await userDataController.getTodayData(patient._id);
  } catch (err) {
    console.log(err);
  }
  try {
    patientHasData = await getPatientHasData(patient._id);
  } catch (err) {
    console.log(err);
  }
  // console.log(patientUserData);
  // console.log(patientHasData);

  patientDataList = [
    patientUserData.bloodGlucoseData,
    patientUserData.weightData,
    patientUserData.insulinDoseData,
    patientUserData.stepCountData,
  ];

  patient.dataEntries = [];

  for (let i = 0; i < 4; i++) {
    // Clone the metadata
    let data = { ...patientMetadata[i] };
    // Add the data entry
    data.entry = patientDataList[i];
    data.required = patientUserData.requiredFields.includes(i);
    data.exists = patientHasData[i];
    data.isDisabled = data.exists && !data.required;
    data.index = i;
    //console.log(data.entry);
    // Add the entry to patient
    if (/*data.exists ||*/ data.required) {
      patient.dataEntries.push(data);
    }
  }
  console.log(patient);
  return patient;
};

const getPatientHasData = async (patientID) => {
  let patientData = await UserData.findOne({ userId: patientID }).lean();

  let hasData = [];

  hasData.push(patientData.bloodGlucoseData.length > 0);
  hasData.push(patientData.weightData.length > 0);
  hasData.push(patientData.insulinDoseData.length > 0);
  hasData.push(patientData.stepCountData.length > 0);

  return hasData;
};

module.exports = {
  renderPatientDashboard,
  getPatientHasData,
};
