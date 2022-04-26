const express = require('express');
const app = express();

app.post('/mock-login', (req, res) => {
  // TODO: Implement login functionality
  const { email, password } = req.body;
  console.warn('SIGN IN NOT IMPLEMENTED');
  console.debug('login email: ', email, ', password: ', password);
  const isPatient = true;
  if (isPatient) {
    res.redirect('/patient-main-dashboard');
  } else {
    res.redirect('/cli/1');
  }
});

app.post('/mock-sign-up', (req, res) => {
  // TODO: Implement sign up functionality
  console.warn('SIGN UP NOT IMPLEMENTED');
  res.redirect('/cli/1');
});

module.exports = app;
