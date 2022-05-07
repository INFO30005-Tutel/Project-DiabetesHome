const express = require('express');
const app = express();
const controller = require('../controllers/delivery2-mock');

app.post('/login', controller.mockLogin);

app.post('/sign-up', controller.mockLogin);

// Use to test in POSTMAN
// Format:
// {
//   "type": "0",
//   "data": "67",
//   "note": "I eat a lot of sugar"
// }
app.post('/userdata', controller.mockUpdate);

module.exports = app;