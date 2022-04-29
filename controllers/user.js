// Controller to perform CRUD on user parameter
const User = require('../models/user');
const helper = require('./helper');

exports.updateSelf = (req, res) => {
  console.log('updateSelf');
  // Get the id
  const id = req.user._id;

  // Case of updated sucessfully
  User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((updatedData) => {
      res.status(200).send(updatedData);
    })
    // Case of error
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: 'Error when updating Data!',
      });
    });
};

// Delete this user and also his/her user-data block
exports.delete = async (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(async (data) => {
      if (!data) {
        // If no id found -> return error message
        return res
          .status(404)
          .send({ message: 'No data found to be deleted!' });
      }
      // Else, continue to delete its user-data data block
      await UserData.findByIdAndDelete({ userId: id }).then((userdata) => {
        if (!userdata) {
          res.status(500).send({ message: 'Missing userdata for this user!' });
        }
      });
      res.status(200).send({ message: 'Data is deleted successfully!' });
    })
    // Catching error when accessing the database
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error accessing the database!' });
    });
};

exports.changePassword = async (req, res) => {
  if (!req.user) {
    return console.error();
  }

  console.log(req.body);

  let user = await User.findOne({ email: req.user.email });

  if (user.verifyPassword(req.body.oldPassword)) {
    user.password = user.hashPassword(req.body.newPassword);

    await user.save();
    res.send(user);
  } else {
    // return new Error("Wrong password")
    return res.status(401).send('Wrong password');
  }
};

exports.getPatients = (req, res) => {
  if (req.user.clinicianId) {
    return;
  }

  User.find({ clinicianId: req.user._id })
    .then((datas) => {
      return res.status(200).send(datas);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error accessing the database!' });
    });
};

// Debugging methods
exports.findOne = (req, res) => {
  helper.findData(User, req, res);
};
exports.findAll = (req, res) => {
  helper.findAllData(User, req, res);
}

exports.update = (req, res) => {
  helper.updateData(User, req, res);
};
