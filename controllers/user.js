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
  console.log(updateBody);
  // Case of updated sucessfully
  User.findByIdAndUpdate(id, { $set: updateBody }, { new: true })
    .then((updatedData) => {
      if (updatedData) {
        return true;
      }
      return false;
    })
    // Case of error
    .catch((err) => {
      console.log(err);
      return false
    });
};

const changePassword = async (req) => {
  if (!req.user) {
    return console.error();
  }

  console.log(req.body);

  let user = await User.findOne({ email: req.user.email });

  if (user.verifyPassword(req.body.oldPassword)) {
    user.password = user.hashPassword(req.body.newPassword);

    await user.save();
    return true;
  } else {
    // return new Error("Wrong password")
    return false;
  }
};

module.exports = {
  getPersonalInfo,
  updateSelf,
  changePassword,
};
