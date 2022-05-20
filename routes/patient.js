const express = require('express');
const app = express();

const patientController = require('../controllers/patient');
const helper = require('../controllers/helper');

app.get(
  '/patient',
  helper.isAuthenticated,
  helper.isPatient,
  patientController.renderPatientDashboard
);
app.get(
  '/patient/setting',
  helper.isAuthenticated,
  helper.isPatient,
  patientController.renderSetting
);
app.get(
  '/patient/view-data/:dataSeries',
  helper.isAuthenticated,
  helper.isPatient,
  patientController.renderPatientDetails
);
app.get(
  '/patient/messages',
  helper.isAuthenticated,
  helper.isPatient,
  patientController.renderPatientMessages
);

module.exports = app;
