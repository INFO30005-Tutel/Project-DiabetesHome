const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

app.get('/', (req, res) => {
  res.render('homepage.hbs');
});

app.get('/about-diabetes', (req, res) => {
  res.render('about-diabetes.hbs');
});

app.get('/about-this-website', (req, res) => {
  res.render('about-this-website.hbs');
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.clinicianId) {
      return res.redirect('/patient');
    } else {
      return res.redirect('/clinician');
    }
  } else {
    res.render('login.hbs', { flash: req.flash('error') });
  }
});

app.get('/register', (req, res) => {
  res.render('register.hbs', { flash: req.flash('error') });
});

app.get('/staying-motivated', (req, res) => {
  res.render('staying-motivated.hbs');
});
app.get('/measuring-blood-glucose', (req, res) => {
  res.render('measuring-blood-glucose.hbs');
});
app.get('/press-kit', (req, res) => {
  res.render('press-kit.hbs');
});
app.get('/contact-us', (req, res) => {
  res.render('contact-us.hbs');
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
