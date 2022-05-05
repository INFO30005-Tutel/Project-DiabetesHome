const express = require('express');
const app = express();

const controller = require('../controllers/user');

// {
//   oldPassword: "oldpassword",
//   newPassword: "newpassword"
// }
app.post('/user/change-password', controller.changePassword);

app.put('/user', controller.updateSelf);

app.delete('/user', controller.delete);

app.get('/get-patients', controller.getPatients);

// Additional apis for dev's debugging
app.get('/user', controller.findAll);
app.get('/user/:id', controller.findOne);
app.put('/user/:id', controller.update);

module.exports = app;
