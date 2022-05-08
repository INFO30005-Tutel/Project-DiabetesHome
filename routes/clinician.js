const express = require('express');
const app = express();

const controller = require('../controllers/clinician');
const helper = require('../controllers/helper');

app.get(
  '/clinician',
  helper.isAuthenticated,
  controller.renderClinicianDashboard
);

module.exports = app;
