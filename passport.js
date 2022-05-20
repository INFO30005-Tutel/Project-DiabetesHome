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
            now = new Date();
            const newUser = new User();
            newUser.email = email.toLowerCase().trim();
            newUser.password = newUser.hashPassword(password);
            newUser.leaderboardName = req.body.leaderboardName.trim();
            newUser.firstName = req.body.firstName.trim();
            newUser.lastName = req.body.lastName.trim();
            newUser.dateOfRegistration = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            newUser.dateOfBirth = new Date(req.body.dateOfBirth);
            newUser.phoneNumber = req.body.phoneNumber.trim();
            newUser.clinicianId = req.body.clinicianId || null;

            // Validate
            if (newUser.email == '') return done(null, false, { message: 'Email cannot be empty' });
            if (newUser.firstName == '')
              return done(null, false, { message: 'First name cannot be empty' });
            if (newUser.lastName == '')
              return done(null, false, { message: 'Last name cannot be empty' });
            if (newUser.phoneNumber == '')
              return done(null, false, { message: 'Phone number cannot be empty' });
            if (!/^\+*[0-9]+$/.test(newUser.phoneNumber))
              return done(null, false, {
                message: 'Phone number can only contain plus sign (+) and number',
              });
            if (password.trim() == '')
              return done(null, false, { message: 'Password cannot be empty' });
            if (/\s/.test(password))
              return done(null, false, { message: 'Password cannot contain space' });
            if (newUser.dateOfBirth.getTime() > now.getTime())
              return done(null, false, { message: 'Date of birth is invalid' });

            newUser.save().then((savedUser) => {
              // If this user is a patient
              if (req.body.clinicianId) {
                const newUserdata = new UserData({
                  userId: savedUser._id,
                  bloodGlucoseData: [],
                  stepCountData: [],
                  insulinDoseData: [],
                  weightData: [],
                  requiredFields: req.body.requiredFields || [0, 1, 2, 3],
                  bloodGlucoseLowThresh: req.body.bloodGlucoseLowThresh,
                  bloodGlucoseHighThresh: req.body.bloodGlucoseHighThresh,
                  weightLowThresh: req.body.weightLowThresh,
                  weightHighThresh: req.body.weightHighThresh,
                  insulinDoseLowThresh: req.body.insulinDoseLowThresh,
                  insulinDoseHighThresh: req.body.insulinDoseHighThresh,
                  stepCountLowThresh: req.body.stepCountLowThresh,
                  stepCountHighThresh: req.body.stepCountHighThresh,
                });
                newUserdata.save().then((savedUserData) => {
                  return done(null, newUser);
                });
              } else {
                // This user is a clinician. Not need to add userdata
                return done(null, newUser);
              }
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
