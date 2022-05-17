const express = require('express');
const app = express();

const controller = require('../controllers/patient');
const helper = require('../controllers/helper');

app.get('/patient', helper.isAuthenticated, controller.renderPatientDashboard);
app.get('/patient/setting', helper.isAuthenticated, controller.renderSetting);
app.get('/patient/view-data/:dataSeries', helper.isAuthenticated, controller.renderPatientDetails);

module.exports = app;
