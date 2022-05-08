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
          return done(null, false, { message: 'Incorrect username.' });
        }
        user.verifyPassword(password, (err, valid) => {
          if (err) {
            return done(null, false, { message: 'Unknown error.' });
          }
          if (!valid) {
            return done(null, false, { message: 'Incorrect password.' });
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
    async (req, email, password, done) => {
      await User.findOne({ email: email }, async (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false, { message: 'Account existed' });
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
          await newUser.save(async (err, user) => {
            // When register successfully --> Auto-create empty user-data
            const newUserdata = new UserData({
              userId: user._id,
              bloodData: [],
              exerciseData: [],
              insulinData: [],
              weightData: [],
            });
            await newUserdata.save();
          });
          console.log('111111111111111');
          return done(null, newUser);
        }
      });
    }
  )
);

module.exports = passport;
