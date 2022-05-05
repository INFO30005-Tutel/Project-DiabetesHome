const express = require('express');
const app = express();

const controller = require('../controllers/clinician');

app.get('/clinician/:clinician_id', controller.getDashboardData);

// Next 2 route are for testing
app.get('/clinician/:clinician_id/:id2', controller.getDashboardData);
app.get('/clinician/:clinician_id/:id2/:id3', controller.getDashboardData);

module.exports = app;
