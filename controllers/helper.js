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

// Get patient's engagement
function getEngagementData(dateOfRegistration, patientData) {
  let patientDataList = [
    patientData.bloodGlucoseData,
    patientData.weightData,
    patientData.insulinDoseData,
    patientData.stepCountData,
  ];
  let patientDataIndices = [];
  patientDataList.forEach(() => {
    patientDataIndices.push(0);
  })
  let engagementSinceStart = [];
  let date = dateOfRegistration;
  let now = new Date();
  let tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
  // Loop over all days since the user registered
  while(date < tomorrowDate) {
    let nextDate = new Date();
    nextDate.setDate(date.getDate()+1);
    let hasEntry = false;
    for(let i = 0; i < patientDataIndices.length; ++i) {
      // Increment the index until we get to the most recent entry on this date
      while (patientDataIndices[i] < patientDataList[i].length && 
        patientDataList[i][patientDataIndices[i]].inputAt < nextDate) {
          patientDataIndices[i]++;
      }
      // If there is an entry on this day
      if (patientDataIndices[i] < patientDataList[i].length &&
        patientDataList[i][patientDataIndices[i]].inputAt >= date) {
        hasEntry = true;
      }
    }
    engagementSinceStart.push(hasEntry);
    date = nextDate;
  }
  return {
    engagementSinceStart: engagementSinceStart,
    startDate: dateOfRegistration,
    endDate: tomorrowDate,
    engagementRate: getEngagementRate(engagementSinceStart),
    streak: getStreak(engagementSinceStart),
    longestStreak: getLongestStreak(engagementSinceStart)
  }
}

function getEngagementRate(engagementSinceStart) {
  let days_engaged = 0;
  engagementSinceStart.forEach((isEngaged) => {
    days_engaged += isEngaged ? 1 : 0;
  });
  return days_engaged/engagementSinceStart.length;
}

function getStreak(engagementSinceStart) {
  let streak = 0;
  for (let i = engagementSinceStart.length-1; i >= 0; --i) {
    if (!engagementSinceStart[i]) {
      break;
    }
    ++streak;
  }
  return streak;
}

function getLongestStreak(engagementSinceStart) {
  let longestStreak = 0;
  let streak = 0;
  for (let i = engagementSinceStart.length-1; i >= 0; --i) {
    if (!engagementSinceStart[i]) {
      streak = 0;
    }
    ++streak;
    if (streak > longestStreak) {
      longestStreak = streak;
    }
  }
  return longestStreak;
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
  getEngagementData
};
