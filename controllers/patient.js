const handlebars = require('handlebars');
const userDataController = require('./user-data');
const helperController = require('./helper');
const userController = require('./helper');
const UserData = require('../models/user-data');

const patientMetadata = [
  {
    name: 'Blood Glucose',
    units: 'mmol/L',
    shortName: 'glucose',
    iconImage: '/images/blood-glucose.svg',
    minValid: 1,
    maxValid: 150, // Michael Patrick Buonocore, USA survived a 147.6 mmol/L
    incStep: 0.01,
  },
  {
    name: 'Weight',
    units: 'kg',
    shortName: 'weight',
    iconImage: '/images/weight.svg',
    minValid: 0,
    maxValid: 700, // Jon Brower Minnoch weights 635 kg
    incStep: 0.1,
  },
  {
    name: 'Insulin Doses',
    units: 'doses',
    shortName: 'insulin',
    iconImage: '/images/insulin.svg',
    minValid: 0,
    maxValid: 99, // arbitrary
    incStep: 1,
  },
  {
    name: 'Exercise',
    units: 'steps',
    shortName: 'exercise',
    iconImage: '/images/exercise.svg',
    minValid: 0,
    maxValid: 999999, // arbitrary
    incStep: 1,
  },
];

// handle dashboard data
const renderPatientDashboard = async (req, res) => {
  const patient = req.user;
  const dateAndTime = helperController.getDateAndTime(new Date());
  res.render('patient/patient-dashboard.hbs', {
    layout: 'patient-layout.hbs',
    userId: patient._id,
    // Not normal UserData, but a combined User and UserData
    userData: await getPatientData(patient),
    metadata: patientMetadata,
    date: dateAndTime.date,
    weekDay: dateAndTime.weekDay,
    time: dateAndTime.time,
    inputDates: await userDataController.getAllDataDates(patient._id),
  });
};

// handle patient data
const renderPatientDetails = async (req, res) => {
  const metadata = findDataById(patientMetadata, req.params.dataSeries);
  const patient = req.user;
  const todayAllData = await getPatientData(patient);
  const todayData = findDataById(todayAllData.dataEntries, req.params.dataSeries);

  const allDataHistory = await userDataController.getDetailedData(patient._id);
  let dataId;
  switch (req.params.dataSeries) {
    case 'glucose':
      dataId = 'detailed-blood';
      break;
    case 'weight':
      dataId = 'detailed-weight';
      break;
    case 'insulin':
      dataId = 'detailed-insulin';
      break;
    case 'exercise':
      dataId = 'detailed-step';
      break;
  }
  const dataHistory = findDataById(allDataHistory, dataId, 'id');
  res.render('patient/patient-details.hbs', {
    layout: 'patient-layout.hbs',
    metadata: metadata,
    todayData: todayData,
    historicalData: dataHistory.data
  })
}

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
  //console.log(patient);
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

const findDataById = (data, id, id_label = 'shortName') => {
  let dataElement;
  data.forEach(element => {
    if (element[id_label] === id) {
      dataElement = element;
    }
  });
  return dataElement;
}

const renderSetting = async (req, res) => {
  const personalInfo = await userController.getPersonalInfo(req.user._id);
  const clinicianInfo = await userController.getPersonalInfo(personalInfo.clinicianId);
  const formattedDob = helperController.getDateAndTime(personalInfo.dateOfBirth);
  const formattedRegDate = helperController.getDateAndTime(personalInfo.dateOfRegistration);

  res.render('shared/setting.hbs', {
    layout: 'patient-layout.hbs',
    isPatient: true,
    personalInfo: personalInfo,
    clinicianInfo: clinicianInfo,
    formattedDob: formattedDob,
    formattedRegDate: formattedRegDate,
  });
}

module.exports = {
  renderPatientDashboard,
  getPatientHasData,
  renderPatientDetails,
  renderSetting,
};
