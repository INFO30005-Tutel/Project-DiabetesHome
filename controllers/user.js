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

const updateSelf = async (id, updateBody) => {
  // console.log(updateBody);
  let updatedUser = await User.findByIdAndUpdate(id, { $set: updateBody }, { new: true });

  if (updatedUser) {
    return true;
  }
  return false;
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
  updateSelf,
  changePassword,
};
