
const express = require('express');
const app = express();
const passport = require('passport');
const MessageController = require('../controllers/messages');
const NoteController = require('../controllers/notes');

const clinicianController = require('../controllers/clinician');
const userDataController = require('../controllers/user-data');
const userController = require('../controllers/user');
const helper = require('../controllers/helper');

app.get(
  '/clinician',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.renderClinicianDashboard
);

app.get(
  '/clinician/register-patient',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.renderRegisterPatient
);

app.get(
  '/clinician/view-patient/:patId',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.renderPatientProfile
);

app.post('/change-parameter/:id', helper.isAuthenticated, helper.isClinician, async (req, res) => {
  let updatedUserData = await userDataController.changePatientRecordParameter(req, res);
  if (updatedUserData) {
    res.redirect('back');
  } else {
    console.log('Error - updated thresholds failed!');
  }
});

//app.get('/clinician/messages/:patId', helper.isAuthenticated, controller.renderNotesForPatient);

app.get('/clinician/message/:patId', clinicianController.renderMessages);

//app.get('/clinician/notes/:patId', helper.isAuthenticated, controller.renderMessagesForPatient);

app.get('/clinician/note/:patId', clinicianController.renderNotes);

app.post(
  '/clinician/register-patient',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.formatPatientRegister,
  passport.authenticate('register', {
    session: false,
    failureRedirect: '/clinician/register-patient',
    successRedirect: '/clinician',
    failureFlash: true,
  })
);

app.post(
  '/clinician/message/:patId',
  //helper.isAuthenticated,
  MessageController.sendMessage
)

app.post('/clinician/note/:patId',
  //helper.isAuthenticated,
  NoteController.addNote
)

app.post('/clinician/delete-message/:patId',
  //helper.isAuthenticated,
  MessageController.deleteMessage
)

app.post('/clinician/delete-note/:patId',
  //hepler.isAuthenticated,
  NoteController.deleteNote
)
app.get(
  '/clinician/setting',
  helper.isAuthenticated,
  helper.isClinician,
  clinicianController.renderSetting
);

module.exports = app;
