
const express = require('express');
const app = express();
const passport = require('passport');

const controller = require('../controllers/clinician');
const MessageController = require('../controllers/messages');
const NoteController = require('../controllers/notes');
const helper = require('../controllers/helper');

app.get('/clinician', helper.isAuthenticated, controller.renderClinicianDashboard);

app.get('/clinician/register-patient', helper.isAuthenticated, controller.renderRegisterPatient);

app.get('/clinician/view-patient/:patId', helper.isAuthenticated, controller.renderPatientProfile);

//app.get('/clinician/messages/:patId', helper.isAuthenticated, controller.renderNotesForPatient);

app.get('/clinician/messages/:patId', controller.renderMessages);

//app.get('/clinician/notes/:patId', helper.isAuthenticated, controller.renderMessagesForPatient);

app.get('/clinician/notes/:patId', controller.renderNotes);

app.post(
  '/clinician/register-patient',
  helper.isAuthenticated,
  controller.formatPatientRegister,
  passport.authenticate('register', {
    session: false,
    failureRedirect: '/clinician/register-patient',
    successRedirect: '/clinician',
    failureFlash: true,
  })
);

app.post(
  '/clinician/messages/:patId',
  //helper.isAuthenticated,
  MessageController.sendMessage
)

app.post('/clinician/notes/:patId',
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

module.exports = app;
