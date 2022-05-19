const express = require('express');
const app = express();
const passport = require('passport');

const clinicianController = require('../controllers/clinician');
const userDataController = require('../controllers/user-data');
const userController = require('../controllers/user');
const helper = require('../controllers/helper');

app.get(
  '/clinician',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.renderClinicianDashboard
);

app.get(
  '/clinician/register-patient',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.renderRegisterPatient
);

app.get(
  '/clinician/view-patient/:patId',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.renderPatientProfile
);

app.post('/change-parameter/:id', helper.isAuthenticated, helper.isClinician, async (req, res) => {
  let updatedUserData = await userDataController.changePatientRecordParameter(req, res);
  if (updatedUserData) {
    res.redirect('back');
  } else {
    console.log('Error - updated thresholds failed!');
  }
});

app.post(
  '/clinician/register-patient',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.formatPatientRegister,
  passport.authenticate('register', {
    session: false,
    failureRedirect: '/clinician/register-patient',
    successRedirect: '/clinician',
    failureFlash: true,
  })
);

app.get(
  '/clinician/setting',
  helper.isAuthenticated,
  clinicianController.renderSetting
);

module.exports = app;
