const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const UserData = require('./models/user-data');

// Updated serialize/deserialize functions
passport.serializeUser((user, done) => {
  done(undefined, user._id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId, (err, user) => {
    if (err) {
      return done(err, undefined);
    }
    return done(undefined, user);
  });
});

// Does the login and returns a token if login successfully
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    (username, password, done) => {
      User.findOne({ email: username.toLowerCase() }, function (err, user) {
        console.log('ASASASAS');
        console.log(user);
        if (err) {
          return done(null, false, { message: 'Unknown error.' });
        }
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        user.verifyPassword(password, (err, valid) => {
          if (err) {
            return done(null, false, { message: 'Unknown error.' });
          }
          if (!valid) {
            return done(null, false, {
              message: 'Incorrect username or password.',
            });
          }
          return done(null, user);
        });
      });
    }
  )
);

// Register for an account
// Will change later to match the patient's register process
passport.use(
  'register',
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: 'email',
    },
    (req, email, password, done) => {
      User.findOne({ email: email })
        .then((foundUser) => {
          if (foundUser) {
            console.log('Account existed');
            return done(null, false, { message: 'Account already existed!' });
          } else {
            const newUser = new User();
            newUser.email = email.toLowerCase();
            newUser.password = newUser.hashPassword(password);
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.dateOfBirth = new Date(req.body.dateOfBirth);
            newUser.phoneNumber = req.body.phoneNumber || '';
            newUser.clinicianId = req.body.clinicianId || null;

            if (req.body.clinicianId) {
              // by default patient: all fields to be activated (if not provided)
              newUser.requiredFields = req.body.requiredFields || [0, 1, 2, 3];
            }
            newUser.save().then((savedUser) => {
              // When register successfully --> Auto-create empty user-data
              const newUserdata = new UserData({
                userId: savedUser._id,
                bloodData: [],
                exerciseData: [],
                insulinData: [],
                weightData: [],
              });
              newUserdata.save().then((savedUserData) => {
                return done(null, newUser);
              });
            });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  )
);

module.exports = passport;
