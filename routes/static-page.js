const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

app.get('/', (req, res) => {
  res.render('homepage.hbs', {isAuthenticated: req.isAuthenticated()});
});

app.get('/about-diabetes', (req, res) => {
  res.render('about-diabetes.hbs', {isAuthenticated: req.isAuthenticated()});
});

app.get('/about-this-website', (req, res) => {
  res.render('about-this-website.hbs', {isAuthenticated: req.isAuthenticated()});
});

app.get('/login', (req, res) => {
  // Redirect if the user is already logged in
  if (req.isAuthenticated()) {
    if (req.user.clinicianId === null) {
      // Redirect to clinician dashboard
      res.redirect('/clinician');
      return;
    } else {
      // Redirect to patient dashboard
      res.redirect('patient');
      return;
    }
  }
  res.render('login.hbs', { flash: req.flash('error') });
});

app.get('/register', (req, res) => {
  res.render('register.hbs', { flash: req.flash('error') });
});

app.get('/staying-motivated', (req, res) => {
  res.render('staying-motivated.hbs', {isAuthenticated: req.isAuthenticated()});
});
app.get('/measuring-blood-glucose', (req, res) => {
  res.render('measuring-blood-glucose.hbs', {isAuthenticated: req.isAuthenticated()});
});
app.get('/press-kit', (req, res) => {
  res.render('press-kit.hbs', {isAuthenticated: req.isAuthenticated()});
});
app.get('/contact-us', (req, res) => {
  res.render('contact-us.hbs', {isAuthenticated: req.isAuthenticated()});
});

app.post('/contact-us', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.HOST_PASS,
    },
  });
  const { name, email, message } = req.body;
  const mailOption = {
    from: email,
    to: process.env.HOST_EMAIL,
    subject: `Message from ${email}`,
    text: message,
  };
  transporter.sendMail(mailOption, (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).send('Something went wrong');
    } else {
      res.render('contact-us.hbs');
    }
  });
});

module.exports = app;
