const express = require('express');
const app = express();

const controller = require('../controllers/patient');

app.get('/patient/:patient_id', controller.getDashboardData);

module.exports = app;
