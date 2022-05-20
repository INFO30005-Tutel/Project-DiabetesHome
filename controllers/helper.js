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

const isPatient = (req, res, next) => {
  // user don't have clinicianId -> user is clinician, not allowed to access
  if (!req.user.clinicianId) {
    req.flash('error', 'Requires logged in as patient to access');
    return res.redirect('/login');
  }
  // Otherwise, proceed to next middleware function
  return next();
};

const isClinician = (req, res, next) => {
  // user has clinicianId -> user is patient, not allowed to access
  if (req.user.clinicianId) {
    req.flash('error', 'Requires logged in as clinician to access');
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
  });
  if (dateOfRegistration) {
    dateOfRegistration = new Date(
      dateOfRegistration.getFullYear(),
      dateOfRegistration.getMonth(),
      dateOfRegistration.getDate()
    );
  } else {
    console.log('Patient ' + patientData.userId + " don't have a dateOfRegistration!");
    dateOfRegistration = new Date();
  }

  let engagementSinceStart = [];
  let date = dateOfRegistration;
  let now = new Date();
  let tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  // Loop over all days since the user registered
  while (date < tomorrowDate) {
    let nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    let hasEntry = false;
    for (let i = 0; i < patientDataIndices.length; ++i) {
      // Increment the index until we get to the most recent entry on this date
      while (
        patientDataIndices[i] < patientDataList[i].length &&
        patientDataList[i][patientDataIndices[i]].inputAt < date
      ) {
        patientDataIndices[i]++;
      }
      // If there is an entry on this day
      if (
        patientDataIndices[i] < patientDataList[i].length &&
        patientDataList[i][patientDataIndices[i]].inputAt <= nextDate
      ) {
        hasEntry = true;
      }
    }
    engagementSinceStart.push(hasEntry);
    date = nextDate;
  }
  return {
    engagementSinceStart: engagementSinceStart,
    hasDataToday: engagementSinceStart[engagementSinceStart.length - 1],
    startDate: dateOfRegistration,
    endDate: tomorrowDate,
    engagementRate: getEngagementRate(engagementSinceStart),
    streak: getStreak(engagementSinceStart),
    longestStreak: getLongestStreak(engagementSinceStart),
  };
}

function getEngagementRate(engagementSinceStart) {
  let days_engaged = 0;
  engagementSinceStart.forEach((isEngaged) => {
    days_engaged += isEngaged ? 1 : 0;
  });
  return days_engaged / engagementSinceStart.length;
}

function getStreak(engagementSinceStart) {
  let streak = 0;
  for (let i = engagementSinceStart.length - 1; i >= 0; --i) {
    if (!engagementSinceStart[i]) {
      if (i == engagementSinceStart.length - 1) {
        // It is today so we don't break the streak
        continue;
      }
      break;
    }
    ++streak;
  }
  return streak;
}

function getLongestStreak(engagementSinceStart) {
  let longestStreak = 0;
  let streak = 0;
  for (let i = engagementSinceStart.length - 1; i >= 0; --i) {
    if (!engagementSinceStart[i]) {
      streak = 0;
    } else {
      ++streak;
    }
    if (streak > longestStreak) {
      longestStreak = streak;
    }
  }
  return longestStreak;
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

var formatDateTime = (inputDT) => {
  const dateAndTime = getDateAndTime(inputDT);
  var result = dateAndTime.time.toString() + dateAndTime.date.toString();
  return result;
}

const styleSingleNoteOrMessage = function (fontFamily, fontSize, fontWeight, fontStyle, textAlign) {
  const defaultStyle = "background-color: #D0E0F1; width:350px; height:350px; border-radius: 16px; color:#011684;position: relative;display: inline-block; padding-top: 20px; padding-left: 20px;";
  const inputStyle = `font-family: ${fontFamily} !important;font-size: ${fontSize};font-weight: ${fontWeight};font-style: ${fontStyle};text-align: ${textAlign};`;

  return defaultStyle + inputStyle;
};
// // Update a data identified by the data's Id =====================================
// function updateData(controller, req, res) {
//   // Get the id
//   const id = req.params.id;

//   // Case of updated sucessfully
//   controller
//     .findByIdAndUpdate(
//       id,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     )
//     .then((updatedData) => {
//       res.status(200).send(updatedData);
//     })
//     // Case of error
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({
//         message: 'Error when updating Data!',
//       });
//     });
// }

// // Delete a data with the specified data's Id ====================================
// function deleteData(controller, req, res) {
//   const id = req.params.id;
//   controller
//     .findByIdAndDelete(id)
//     .then((data) => {
//       if (!data) {
//         // If no id found -> return error message
//         return res
//           .status(404)
//           .send({ message: 'No data found to be deleted!' });
//       }
//       // Else, the data should be deleted successfully
//       res.status(200).send({ message: 'Data is deleted successfully!' });
//     })
//     // Catching error when accessing the database
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({ message: 'Error accessing the database!' });
//     });
// }

// // Retrieve and return all data from the database =================================
// function findAllData(controller, req, res) {
//   // Return all data using find()
//   controller
//     .find()
//     .then((data) => {
//       res.send(data);
//     })
//     // Catching error when accessing the database
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({ message: 'Error when accessing the database!' });
//     });
// }

// // Retrieve and return data given the id =========================================
// function findData(controller, req, res) {
//   const id = req.params.id;
//   // Return all data using findOne()
//   controller
//     .findOne({ id: id })
//     .then((data) => {
//       res.send(data);
//     })
//     // Catching error when accessing the database
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({ message: 'Error when accessing the database!' });
//     });
// }
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
  isPatient,
  isClinician,
  formatThreshold,
  formatDateTime,
  styleSingleNoteOrMessage,
  getUserDataId,
  getEngagementData,
};
