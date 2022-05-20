const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  dateOfRegistration: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  leaderboardName: {
    // Clinician don't use this
    // If not specified, it will be the first letters of their name
    // when rendered the leaderboard (not saved to database)
    // Ex: Davie Noon will appeared as "D. N."
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  clinicianId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Null if clinician, a valid objectID is patient
  },
  // avatar: {
  //   type: String,
  //   required: false,
  // },
});

// This code block is for password encryption
UserSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.verifyPassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, valid) => {
    done(err, valid);
  });
};

module.exports = mongoose.model('User', UserSchema);
