// Start with /api/...
// These are API that not render a .hbs file, just res.send() data back. Used for testing or POSTMAN.
const express = require('express');
const app = express();
const controller = require('../controllers/user-data');

app.get('/today-userdata', controller.getTodayData);

// Get data during a period of time: week/month/year
// Req.json = {
//     from: Date,
//     to: Date,
//     type: int [blood/exercise/insulin/weight]
// }
app.post('/get-data-during', controller.getDataDuring);

// {
//   type: int (type index),
//   data: double/float/number
// }
app.put('/userdata/:id', controller.update);
app.get('/userdata', controller.findAll);
app.get('/userdata/:id', controller.findOne);

module.exports = app;
