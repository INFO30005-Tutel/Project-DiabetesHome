const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    clinicianId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Null if clinician
    },
    requiredFields: [{
      type: Number
    }],
    // avatar: {
    //   type: String,
    //   required: false,
    // },
  }
);

// This code block is for password encryption
// UserSchema.methods.hashPassword = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// };

// UserSchema.methods.verifyPassword = function (password) {
//   return bcrypt.compareSync(password, this.password);
// };

module.exports = mongoose.model('User', UserSchema);
