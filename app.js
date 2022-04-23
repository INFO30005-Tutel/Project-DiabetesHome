// Load envioronment variables 
if (process.env.NODE_ENV !== 'production') { 
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const app = express();
//app.use(express.json())
app.use(express.urlencoded({ extended: true })); // replaces body-parser
app.use(express.static('public')); // define where static assets live
app.use(express.json()); // parse application/json
app.use(cors());

const userRoute = require('./routes/user');
// const userDataRoute = require('./routes/user-data');
app.use(userRoute);
// app.use(us=erDataRoute);

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
  res.render('homepage.hbs');
});
app.get('/about-diabetes', (req, res) => {
  res.render('about-diabetes.hbs');
});
app.get('/about-this-website', (req, res) => {
  res.render('about-this-website.hbs');
});
// CLINICIAN
app.get('/cli/:id1', (req, res) => {
  res.render('clinician/dashboard.hbs', {layout: 'clinician-layout.hbs'});
});
//PATIENT's DASHBOARD
app.get('/patient-dashboard/:id', (req, res)=>{

  res.render('patient/patient-dashboard.hbs',  {layout: 'patient-layout.hbs', userID: req.params.id});
})


// app.all('*', (req, res) => {
//   // 'default' route to catch user errors
//   res
//     .status(404)
//     .render('error', { errorCode: '404', message: 'That route is invalid.' });
// });

// Tells the app to listen on port 3000 and logs that information to the
app.listen(3000, () => {
  console.log('Diabetes Home is listening on port 3000!');
  initMongooseConnection();
});

/** Function to stop connecting the DB and close the app */
function stop(callback) {
  mongoose.disconnect();
  mongoose.connection.once('close', () => {
    server.close(callback);
  });
}

/**
 * Initialize connection to mongoDB and setup on-event emitters.
 * Callback is usually used in test for done()
 * @param {function} callback
 */
 function initMongooseConnection(callback = () => {}) {
  const dbURI = config.dbURI;

  var options = {
    keepAlive: true,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Exit on error 
  mongoose.connection.on('error', err => { 
    console.error(err); 
    process.exit(1) 
  });
  mongoose.connection.on('connecting', () => {
    console.log('🐌Connecting. State🐌 ' + mongoose.connection.readyState); // state 2
  });
  mongoose.connection.on('connected', () => {
    console.log('Connected. State ✔️  ' + mongoose.connection.readyState); // state 1
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected. State ❌ ' + mongoose.connection.readyState); // state 0
  });

  // Actual connection part
  mongoose.connect(dbURI, options);
  var db = mongoose.connection;
  db.on('error', (err) => {
    console.log('Failed to connect to database');
    console.log(err);
    process.exit(1);
  });

  db.once('open', async () => {
    console.log(`Mongo connection started on ${db.host}:${db.port}`);
    console.log('DB Name: ' + db.name);
    callback();
  });
}