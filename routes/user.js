const express = require('express');
const app = express();

const controller = require('../controllers/user');
const passport = require('../passport');

const jwt = require('jsonwebtoken');
app.use(passport.initialize()); // From passport version 0.5.0 you have to add this line for express

// Login and Register route do not need Auth token ===========================================
app.post(
  '/login',
  passport.authenticate('login', { session: false }),
  async (req, res) => {
    let token = jwt.sign({ _id: req.user._id }, process.env.PASSPORT_SECRET, {
      expiresIn: '2d',
    });

    return res.json({ token: token });
  }
);

app.post(
  '/register',
  function (req, res, next) {
    passport.authenticate('registration', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).send({ message: info.message });
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res) => {
    console.log(req.user);
    let token = jwt.sign({ _id: req.user._id }, process.env.PASSPORT_SECRET, {
      expiresIn: '2d',
    });
    // Return token
    return res.json({ token: token });
  }
);

// Other routes from this point require authentication ===========================================
app.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => { res.send(req.user); }
);

app.post(
  '/user/change-password',
  passport.authenticate('jwt', { session: false }), 
  controller.changePassword
);

app.put(
  '/user',
  passport.authenticate('jwt', { session: false }), 
  controller.update
);

app.delete(
  '/user',
  passport.authenticate('jwt', { session: false }),
  controller.delete
);


// Additional apis for dev's debugging
app.get('/user', controller.findAll);
app.get('/user/:id', controller.findOne);


module.exports = app;

