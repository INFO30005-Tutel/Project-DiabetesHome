const express = require('express');
const app = express();
const passport = require('passport');

const controller = require('../controllers/clinician');
const helper = require('../controllers/helper');

app.get('/clinician', helper.isAuthenticated, controller.renderClinicianDashboard);

app.get('/clinician/register-patient', helper.isAuthenticated, controller.renderRegisterPatient);

app.get('/clinician/view-patient/:patId', helper.isAuthenticated, controller.renderPatientProfile);

app.post(
  '/clinician/register-patient',
  helper.isAuthenticated,
  controller.formatPatientRegister,
  passport.authenticate('register', {
    session: false,
    failureRedirect: '/clinician/register-patient',
    successRedirect: '/clinician',
    failureFlash: true,
  })
);

module.exports = app;
