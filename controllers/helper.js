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

const formatThreshold = (name, low, high, unit, defaultLow, defaultHigh) => {
  if (!low) {
    low = defaultLow;
  }
  if (!high) {
    high = defaultHigh;
  }

  return {
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

module.exports = {
  retrieveTodayData,
  getDateAndTime,
  isAuthenticated,
  formatThreshold,
};
