var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

var passport = require('passport'),
  LocalStrategy = require('passport-local');

const User = require('mongoose').model('User');

// Checks for valid token when performing any route (except login and registration)
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.PASSPORT_SECRET,
      passReqToCallback: true,
    },
    function (req, jwt_payload, done) {
      User.findOne({ _id: jwt_payload._id }, function (err, user) {
        if (err) {
          return done(err, false);
        }

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
    }
  )
);

// Does the login and returns a token if login successfully
passport.use(
  'login',
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username.toLowerCase() }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (user && user.verifyPassword(password)) {
        return done(null, user);
      }

      return done(null, false);
    });
  })
);

// Register for an account
// Will change later to match the patient's register process
passport.use(
  'registration',
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async function (req, email, password, done) {

      User.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false, { message: "Account existed" });
        }
        else {
          var newUser = new User();
          newUser.email = email.toLowerCase();
          newUser.password = newUser.hashPassword(password);
          newUser.firstname = req.body.firstname;
          newUser.lastname = req.body.lastname;
          newUser.dob = new Date(req.body.dob);
          newUser.phoneNo = req.body.phoneNo || '';
          newUser.clinicId = req.body.clinicId || null; // Null for now
          // TODO: Validate clinicID
          newUser.clinicianId = req.body.clinicianId || null;
          
          if(req.body.clinicianId){
              // by default patient: all fields to be activated
              newUser.requiredFields = [0, 1, 2, 3];
          }

          newUser.save();
          return done(null, newUser);
        }
      });
    }
  )
);

module.exports = passport;
