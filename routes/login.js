const express = require('express');
const app = express();

app.get('/login', (req, res) => {
  res.render('login.hbs');
});
app.post('/login', (req, res) => {
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
app.get('/sign-up', (req, res) => {
  res.render('sign-up.hbs');
});
app.post('/sign-up', (req, res) => {
  // TODO: Implement sign up functionality
  console.warn('SIGN UP NOT IMPLEMENTED');
  res.redirect('/cli/1');
});

module.exports = app;
