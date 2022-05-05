const express = require('express');
const app = express();

const controller = require('../controllers/clinician');

app.get('/clinician', controller.getDashboardData);
// app.get('/clinician/:clinician_id', controller.getDashboardData);

app.get('/clinician/:pat_id', controller.getPatientData);

module.exports = app;
