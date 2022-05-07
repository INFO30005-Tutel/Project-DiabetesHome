const express = require('express');
const app = express();

const controller = require('../controllers/clinician');

app.get('/clinician', controller.renderClinicianDashboard);

module.exports = app;
