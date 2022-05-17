const express = require('express');
const app = express();

const controller = require('../controllers/patient');
const helper = require('../controllers/helper');

app.get('/patient', helper.isAuthenticated, controller.renderPatientDashboard);
app.get('/patient/:dataSeries', helper.isAuthenticated, controller.renderPatientDetails);

app.get('/patient/setting', helper.isAuthenticated, controller.renderSetting);

module.exports = app;
