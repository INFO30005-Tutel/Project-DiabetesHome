const express = require('express');
const app = express();
const controller = require('../controllers/delivery2-mock');

app.post('/login', controller.mockLogin);

app.post('/sign-up', controller.mockLogin);

app.put('/userdata', controller.mockUpdate);

module.exports = app;
