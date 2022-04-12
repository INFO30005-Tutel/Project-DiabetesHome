const express = require('express');
const app = express();
//app.use(express.json())
app.use(express.urlencoded({ extended: true })); // replaces body-parser
app.use(express.static('public')); // define where static assets live

// Setup Handlebars
const exphbs = require('express-handlebars');
app.engine(
  'hbs',
  exphbs.engine({
    defaultLayout: 'main',
    extname: 'hbs',
  })
);
app.set('View engine', 'hbs'); // set Handlebars view engine

// Routes
const demoRouter = require('./routes/demo-router');
app.use('/demo-management', demoRouter);

app.get('/', (req, res) => {
  res.render('index.hbs');
});
app.get('/about-diabetes', (req, res) => {
  res.render('about-diabetes.hbs');
});
app.get('/about-this-website', (req, res) => {
  res.render('about-this-website.hbs');
});

// app.all('*', (req, res) => {
//   // 'default' route to catch user errors
//   res
//     .status(404)
//     .render('error', { errorCode: '404', message: 'That route is invalid.' });
// });

// Tells the app to listen on port 3000 and logs that information to the
app.listen(3000, () => {
  console.log('Diabetes Home is listening on port 3000!');
});
