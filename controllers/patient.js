const handlebars = require('handlebars');
const userDataController = require('./user-data');
const helperController = require('./helper');
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

const badges = [
  {
    name: 'Thorough',
    engagement: 80,
    icon: '/images/badges/icon-thorough.svg',
  },
  {
    name: 'Diligent',
    engagement: 85,
    icon: '/images/badges/icon-diligent.svg',
  },
  {
    name: 'Devoted',
    engagement: 90,
    icon: '/images/badges/icon-devoted.svg',
  },
  {
    name: 'Meticulous',
    engagement: 95,
    icon: '/images/badges/icon-meticulous.svg',
  },
  {
    name: 'Perfectionist',
    engagement: 98,
    icon: '/images/badges/icon-perfectionist.svg',
  },
];

// handle dashboard data
const renderPatientDashboard = async (req, res) => {
  const patient = await getPatientData(req.user);
  const dateAndTime = helperController.getDateAndTime(new Date());
  const patientEngagement = await getPatientEngagement(req.user);
  patientEngagement.engagementRate = Math.round(patientEngagement.engagementRate * 100);
  patientEngagement.badges = getBadges(patientEngagement.engagementRate);
  let leaderboards = await userDataController.getLeaderboards();
  let podium = getPodium(leaderboards);
  // Truncate leaderboards to top 30
  leaderboards = leaderboards.slice(0, 30);
  res.render('patient/patient-dashboard.hbs', {
    layout: 'patient-layout.hbs',
    userId: patient._id,
    // Not normal UserData, but a combined User and UserData
    userData: patient,
    metadata: patientMetadata,
    engagement: patientEngagement,
    date: dateAndTime.date,
    weekDay: dateAndTime.weekDay,
    time: dateAndTime.time,
    inputDates: await userDataController.getAllDataDates(patient._id),
    leaderboards: leaderboards,
    leaderboardsPodium: podium,
  });
};

// handle patient data
const renderPatientDetails = async (req, res) => {
  const metadata = findDataById(patientMetadata, req.params.dataSeries);
  const patient = req.user;
  const todayAllData = await getPatientData(patient);
  if (!isRequired(todayAllData, req.params.dataSeries)) {
    res.status(403).redirect('/patient');
    return;
  }
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
    historicalData: dataHistory.data,
  });
};

const getPatientData = async (patientUser) => {
  // Clone the patient's User object
  let patient = JSON.parse(JSON.stringify(patientUser));
  let patientUserData;
  let patientHasData;
  let patientEngagement;

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
    if (data.exists || data.required) {
      patient.dataEntries.push(data);
    }
  }
  // Sort the data so disabled entries always comes last
  patient.dataEntries.sort((a, b) => {
    if (a.isDisabled) {
      if (b.isDisabled) {
        return 0;
      }
      return 1;
    }
    return -1;
  });
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

const getPatientEngagement = async (patient) => {
  let patientEngagement;
  try {
    patientEngagement = await userDataController.getPatientEngagement(
      patient.dateOfRegistration,
      patient._id
    );
  } catch (err) {
    console.log(err);
  }
  return patientEngagement;
};

const findDataById = (data, id, id_label = 'shortName') => {
  let dataElement;
  data.forEach((element) => {
    if (element[id_label] === id) {
      dataElement = element;
    }
  });
  return dataElement;
};

const getBadges = (engagement) => {
  let index = -1;
  while (index + 1 < badges.length && engagement >= badges[index + 1].engagement) {
    ++index;
  }
  return {
    badge: badges[index],
    nextBadge: badges[index + 1],
  };
};

const getPodium = (leaderboards) => {
  return {
    first: {
      name: leaderboards[0].name,
      engagementRate: leaderboards[0].engagementRate,
    },
    second: {
      name: leaderboards[1].name,
      engagementRate: leaderboards[1].engagementRate,
    },
    third: {
      name: leaderboards[2].name,
      engagementRate: leaderboards[2].engagementRate,
    },
  };
};

const isRequired = (patient, shortName) => {
  let hasEntry = false;
  patient.dataEntries.forEach((element) => {
    if (element.shortName == shortName) {
      hasEntry = true;
    }
  });
  return hasEntry;
};

module.exports = {
  renderPatientDashboard,
  getPatientHasData,
  renderPatientDetails,
};
