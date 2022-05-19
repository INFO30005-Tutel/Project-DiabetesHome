// Start with /api/...
// These are API that not render a .hbs file, just res.send() data back. Used for testing or POSTMAN.
// Not required authenticated for easier testing. Maybe change this in production
const express = require('express');
const app = express();
const userDataController = require('../controllers/user-data');
const userController = require('../controllers/user');

// THIS FILE IS ROUTE TESTING ONLY DONT USE IT FOR ACTUAL PRODUCTION

// app.post('/change-parameter/:id', async (req, res) => {
//   let updatedUserData = await userDataController.changePatientRecordParameter(req, res);
//   res.status(200).send(updatedUserData);
// });

app.get('/today-userdata/:id', async (req, res) => {
  let todayUserData = await userDataController.getTodayData(req.params.id);
  res.status(200).send(todayUserData);
});

app.post('/update-personal-info', async (req, res) => {
  let isUpdated = await userController.updateSelf(req.user._id, req.body);
  if (isUpdated) {
    res.redirect('back');
  } else {
    console.log('Error - updated personal info failed!');
    res.status(500).redirect('back');
  }
});

app.post('/change-password', userController.changePassword
  // async (req, res) => {
  //   let passwordChanged = await userController.changePassword(req);
  //   if (passwordChanged) {
  //     res.redirect('back');
  //   } else {
  //     console.log('Error - change password failed: either wrong password or confirm password not correct!');
  //     res.status(500).redirect('back');
  //   }}
);

module.exports = app;
