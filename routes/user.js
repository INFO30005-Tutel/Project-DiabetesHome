const express = require('express');
const app = express();
const passport = require('passport');
app.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res) => {
    if (req.user.clinicianId) res.redirect('/patient');
    else res.redirect('/clinician');
  }
);

app.post(
  '/register',
  passport.authenticate('register', {
    failureRedirect: '/register',
    failureFlash: true,
  }),
  (req, res) => {
    if (req.user.clinicianId) res.redirect('/patient');
    else res.redirect('/clinician');
  }
);

app.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = app;
