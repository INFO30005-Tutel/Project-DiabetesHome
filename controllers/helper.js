const { data } = require('jquery');
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

function retrieveDataDates(dataArray) {
  var prevOneYearDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  var todayDate = new Date();
  var dates = new Set();

  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].inputAt < prevOneYearDate) {
      break;
    } else {
      let formatedDate = formatDate(dataArray[i].inputAt);
      if (!dates.has(formatedDate) && formatedDate !== formatDate(todayDate)) {
        dates.add(formatedDate);
      }
    }
  }
  return dates;
}

const formatDate = (dateObject) => {
  let date = JSON.stringify(dateObject.getDate());
  date = date.length < 2 ? '0' + date : date;
  // added 1 to the month since getMonth() return 0 for January
  let month = JSON.stringify(dateObject.getMonth() + 1);
  month = month.length < 2 ? '0' + month : month;
  let year = JSON.stringify(dateObject.getFullYear());

  return `${date}-${month}-${year}`;
};

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
    dateString.getDate() + ' ' + months[dateString.getMonth()] + ' ' + dateString.getFullYear();
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
};

module.exports = {
  retrieveTodayData,
  retrieveDataDates,
  getDateAndTime,
  isAuthenticated,
  formatThreshold,
  getUserDataId,
};
