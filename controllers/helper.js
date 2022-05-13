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

const formatThreshold = (name, low, high, unit) => {
  return {
    thresName: name,
    low: low,
    high: high,
    unit: unit,
  };
};

const getDateAndTime = () => {
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

module.exports = {
  retrieveTodayData,
  getDateAndTime,
  isAuthenticated,
  formatThreshold,
};
