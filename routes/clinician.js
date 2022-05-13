const express = require('express');
const app = express();

const controller = require('../controllers/clinician');
const helper = require('../controllers/helper');

app.get('/clinician', helper.isAuthenticated, controller.renderClinicianDashboard);

app.get('/clinician/register-patient', helper.isAuthenticated, controller.renderRegisterPatient);

app.get('/clinician/view-patient/:patId', helper.isAuthenticated, controller.renderPatientProfile);

module.exports = app;
