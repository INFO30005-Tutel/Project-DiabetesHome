// Start with /api/...
// These are API that not render a .hbs file, just res.send() data back. Used for testing or POSTMAN.
// Not required authenticated for easier testing. Maybe change this in production
const express = require('express');
const app = express();
const userDataController = require('../controllers/user-data');

app.post('/change-parameter/:id', async (req, res) => {
  let updatedUserData = await userDataController.changePatientRecordParameter(req, res);
  res.status(200).send(updatedUserData);
});

app.get('/today-userdata/:id', async (req, res) => {
  let todayUserData = await userDataController.getTodayData(req.params.id);
  res.status(200).send(todayUserData);
});

// // Get data during a period of time: week/month/year
// // Req.json = {
// //     from: Date,
// //     to: Date,
// //     type: int [blood/exercise/insulin/weight]
// // }
// app.post('/get-data-during', userDataController.getDataDuring);

// // {
// //   type: int (type index),
// //   data: double/float/number
// // }
// app.put('/userdata/:id', userDataController.update);
// app.get('/userdata', userDataController.findAll);
// app.get('/userdata/:id', userDataController.findOne);

module.exports = app;
