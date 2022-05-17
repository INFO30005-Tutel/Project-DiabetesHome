const express = require('express');
const app = express();
const passport = require('passport');

const clinicianController = require('../controllers/clinician');
const userDataController = require('../controllers/user-data');
const userController = require('../controllers/user');
const helper = require('../controllers/helper');

app.get('/clinician', helper.isAuthenticated, clinicianController.renderClinicianDashboard);

app.get(
  '/clinician/register-patient',
  helper.isAuthenticated,
  clinicianController.renderRegisterPatient
);

app.get(
  '/clinician/view-patient/:patId',
  helper.isAuthenticated,
  clinicianController.renderPatientProfile
);

app.post('/change-parameter/:id', async (req, res) => {
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
  async (req, res) => {
    const personalInfo = await userController.getPersonalInfo(req.user._id);

    res.render('shared/setting.hbs', {
      layout: 'clinician-layout.hbs',
      personalInfo: personalInfo,
    });
  }
);

module.exports = app;
