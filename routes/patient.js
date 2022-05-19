const express = require('express');
const app = express();

const controller = require('../controllers/patient');
const helper = require('../controllers/helper');

app.get('/patient', helper.isAuthenticated, helper.isPatient, controller.renderPatientDashboard);
app.get(
  '/patient/:dataSeries',
  helper.isAuthenticated,
  helper.isPatient,
  controller.renderPatientDetails
);

module.exports = app;
