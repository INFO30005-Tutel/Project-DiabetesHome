const express = require('express');
const app = express();

const controller = require('../controllers/clinician');

app.get('/cli/:clinician_id', controller.getDashboardData);


module.exports = app;

