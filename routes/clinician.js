const express = require('express');
const app = express();

const controller = require('../controllers/clinician');

app.get('/clinician/:clinician_id', controller.getDashboardData);

module.exports = app;
