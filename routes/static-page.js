const express = require('express');
const app = express();

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
  res.render('login.hbs');
});

app.get('/register', (req, res) => {
  res.render('register.hbs');
});

module.exports = app;
