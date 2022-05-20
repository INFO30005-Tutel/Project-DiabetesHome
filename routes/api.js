// Start with /api/...
const express = require('express');
const app = express();
const userDataController = require('../controllers/user-data');
const userController = require('../controllers/user');
const helper = require('../controllers/helper');

app.get('/today-userdata/:id', async (req, res) => {
  let todayUserData = await userDataController.getTodayData(req.params.id);
  res.status(200).send(todayUserData);
});

app.post('/update-personal-info', helper.isAuthenticated, userController.updatePersonalInfo);

app.post('/change-password', helper.isAuthenticated, userController.changePassword);

module.exports = app;
