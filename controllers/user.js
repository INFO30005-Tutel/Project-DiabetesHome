// Controller to perform CRUD on user parameter
const User = require('../models/user');
const helper = require('./helper');

const getPersonalInfo = async (id) => {
  let personalInfo;
  try {
    personalInfo = await User.findOne({ _id: id }).lean();
  } catch (err) {
    console.log(err);
  }

  //console.log(personalInfo);
  return personalInfo;
};

const updatePersonalInfo = async (req, res) => {
  let id = req.user._id;
  let updateBody = req.body;
  // Trim
  if (updateBody.email) updateBody.email = updateBody.email.trim();
  if (updateBody.firstName) updateBody.firstName = updateBody.firstName.trim();
  if (updateBody.lastName) updateBody.lastName = updateBody.lastName.trim();
  if (updateBody.leaderboardName) updateBody.leaderboardName = updateBody.leaderboardName.trim();
  if (updateBody.dateOfBirth) updateBody.dateOfBirth = new Date(updateBody.dateOfBirth);
  if (updateBody.phoneNumber) updateBody.phoneNumber = updateBody.phoneNumber.trim();

  // Validate
  let valid = true;
  if (updateBody.email == '') {
    req.flash('error', 'Email cannot be empty!');
    valid = false;
  }
  if (updateBody.firstName == '') {
    req.flash('error', 'First name cannot be empty!');
    valid = false;
  }
  if (updateBody.lastName == '') {
    req.flash('error', 'Last name cannot be empty!');
    valid = false;
  }
  if (updateBody.phoneNumber == '') {
    req.flash('error', 'Phone number cannot be empty!');
    valid = false;
  }
  if (!/^\+*[0-9]+$/.test(updateBody.phoneNumber)) {
    req.flash('error', 'Phone number can only contain plus sign (+) and number!');
    valid = false;
  }
  if (updateBody.dateOfBirth.getTime() > new Date().getTime()) {
    req.flash('error', 'Date of birth is invalid!');
    valid = false;
  }

  if (valid) {
    let updatedUser = await User.findByIdAndUpdate(id, { $set: updateBody }, { new: true });
    if (updatedUser) {
      req.flash('info', 'Updated personal info!');
    } else {
      req.flash('error', 'Update personal info failed!');
    }
  }

  res.redirect('back');
};

const changePassword = async (req, res) => {
  if (!req.user) {
    return false;
  }
  console.log(req.body);

  await User.findOne({ email: req.user.email }).then((user) => {
    user.verifyPassword(req.body.oldPassword, async (err, valid) => {
      if (err || !valid) {
        console.log('Wrong password!');
        req.flash('error', 'Wrong password!');
      } else {
        if (/\s/.test(req.body.newPassword)) {
          req.flash('error', 'Password cannot contain space!');
        } else {
          user.password = await user.hashPassword(req.body.newPassword);
          await user.save();
          console.log('Password changed!');
          req.flash('info', 'Password changed!');
        }
      }
      res.redirect('back');
    });
  });
};

module.exports = {
  getPersonalInfo,
  updatePersonalInfo,
  changePassword,
};
