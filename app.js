// Load envioronment variables
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({ extended: true })); // replaces body-parser
app.use(express.static('public')); // define where static assets live
app.use(express.json()); // parse application/json
app.use(cors());

const userRoute = require('./routes/user');
const userDataRoute = require('./routes/user-data');
const staticPageRoute = require('./routes/static-page');
const clinicianRoute = require('./routes/clinician');
const delivery2Mock = require('./routes/delivery2-mock');
const patientRoute = require('./routes/patient');

//app.use(userRoute); // Can be uncommented temporarily to register new user when testing in delivery2
//app.use(userDataRoute);
app.use(delivery2Mock); // if we use mock for delivery 2, need to comment the above 2 routes
app.use(staticPageRoute);
app.use(clinicianRoute);
app.use(patientRoute);

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
