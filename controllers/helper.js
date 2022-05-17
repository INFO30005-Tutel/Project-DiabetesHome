const UserData = require('../models/user-data');

// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
  // If user is not authenticated via Passport, redirect to login page
  if (!req.isAuthenticated()) {
    req.flash('error', 'Requires logged in to access');
    return res.redirect('/login');
  }
  // Otherwise, proceed to next middleware function
  return next();
};

// Retrieve data from an array
function retrieveTodayData(dataArray) {
  var now = new Date();
  var todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var latestData = dataArray[dataArray.length - 1];
  //console.log(latestData);
  if (latestData && latestData.inputAt > todayDate) {
    return latestData;
  } else {
    return 0;
  }
}

function getEngagementData(patientData) {
  let patientDataList = [
    patientUserData.bloodGlucoseData,
    patientUserData.weightData,
    patientUserData.insulinDoseData,
    patientUserData.stepCountData,
  ];
  let patientDataIndices = [];
  patientDataList.forEach((element) => {
    patientDataIndices.push(0);
  })
  let engagementSinceStart = [];
  
}

function getStreak(engagementData) {

}

const formatThreshold = (id, name, low, high, unit, defaultLow, defaultHigh) => {
  if (!low) {
    low = defaultLow;
  }
  if (!high) {
    high = defaultHigh;
  }

  return {
    id: id,
    thresName: name,
    low: low,
    high: high,
    unit: unit,
  };
};

const getDateAndTime = (dateString) => {
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
  //var today = new Date();
  var time =
    dateString.getHours() +
    ':' +
    dateString.getMinutes() +
    ' ' +
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  var weekDay = days[dateString.getDay()] + ', ';
  var date =
    dateString.getDate() +
    ' ' +
    months[dateString.getMonth()] +
    ' ' +
    dateString.getFullYear();
  return {
    time,
    weekDay,
    date,
  };
};

const getUserDataId = async (userId) => {
  let userDataId = '';
  let userData = await UserData.findOne({ userId: userId }).lean();

  if (userData) {
    userDataId = userData._id;
  }

  return userDataId;
}

module.exports = {
  retrieveTodayData,
  getDateAndTime,
  isAuthenticated,
  formatThreshold,
  getUserDataId,
};
