const express = require('express');
const app = express();
const controller = require('../controllers/user-data');

// Other routes from this point require authentication ===========================================
app.get('/todaydata', controller.getTodayData);

// Get data during a period of time: week/month/year
// Req.json = {
//     from: Date,
//     to: Date,
//     type: int [blood/exercise/insulin/weight]
// }
app.post('/getDataDuring', controller.getDataDuring);

// {
//   type: int (type index),
//   data: double/float/number
// }
app.put('/userdata', controller.update);

// Additional apis for dev's debugging
app.get('/userdata', controller.findAll);
app.get('/userdata/:id', controller.findOne);

module.exports = app;
