// Load envioronment variables
require('dotenv').config();
const express = require('express');
const flash = require('express-flash'); // for showing login error messages
const session = require('express-session'); // for managing user sessions
const mongoose = require('mongoose');
const config = require('./config');
const passport = require('./passport.js');
const app = express();
app.use(express.urlencoded({ extended: true })); // replaces body-parser
app.use(express.static('public')); // define where static assets live
app.use(express.json()); // parse application/json
app.use(flash());

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

app.use(
  session({
    // The secret used to sign session cookies (ADD ENV VAR)
    secret: process.env.SESSION_SECRET || 'TutelDiabetesHome',
    saveUninitialized: true,
    resave: true,
    proxy: process.env.NODE_ENV === 'production', //  to work on Heroku
    cookie: {
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 300000, // sessions expire after 5 minutes
    },
  })
);

//app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());

const userRoute = require('./routes/user');
const userDataRoute = require('./routes/user-data');
const staticPageRoute = require('./routes/static-page');
const clinicianRoute = require('./routes/clinician');
const patientRoute = require('./routes/patient');

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(userRoute);
app.use(userDataRoute);
app.use(staticPageRoute);
app.use(clinicianRoute);
app.use(patientRoute);

// Tells the app to listen on port 3000 and logs that information to the
app.listen(port, () => {
  console.log(`⚡Server is running on ${host}:${port}`);
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
  mongoose.connection.on('error', (err) => {
    console.error(err);
    process.exit(1);
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
