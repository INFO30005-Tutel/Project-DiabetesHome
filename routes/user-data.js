const express = require('express');
const app = express();

const controller = require('../controllers/user-data');
const helper = require('../controllers/helper');

app.post(
  '/update-measurement',
  helper.isAuthenticated,
  controller.updateUserDataMeasurement
);

module.exports = app;
