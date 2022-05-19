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

  console.log(personalInfo);
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
    return res.status(404).redirect('back');
  }

  console.log(req.body);

  if (!(req.body.newPassword === req.body.confirmPassword)) {
    req.flash('error', 'Confirm password must match!');
    //req.session.error = 'Confirm password must match!';
    return res.redirect('back', { message: req.flash('error') });
  }
  if (req.body.oldPassword === req.body.newPassword) {
    req.flash('error', 'Please enter new password!');
    // req.session.error = 'Please enter new password!';
    return res.redirect('back');
  }

  await User.findOne({ email: req.user.email }).then(async (user) => {
    if (user) {
      await user.verifyPassword(req.body.oldPassword, (err, valid) => {
        if (err || !valid) {
          req.flash('error', 'Wrong password!');
          return res.redirect('back');
        }

        user.password = user.hashPassword(req.body.newPassword);
        user.save();
        return res.redirect('back');
      });
    }
  });
};

module.exports = {
  getPersonalInfo,
  updateSelf,
  changePassword,
};
