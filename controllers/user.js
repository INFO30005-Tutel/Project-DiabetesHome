// Controller to perform CRUD on user parameter
const User = require('../models/user');
const UserData =  require('../models/user-data');

const helper = require('./helper');

exports.update = (req, res) => {
  helper.updateData(User, req, res);
}

exports.delete = (req, res) => {
  helper.deleteData(User, req, res);
}

exports.changePassword = async (req, res) => {
  if (!req.user) {
    return console.error();
  }

  console.log(req.body)

  let user = await User.findOne({ email: req.user.email });

  if (user.verifyPassword(req.body.oldPassword)) {
    user.password = user.hashPassword(req.body.newPassword);

    await user.save();
    res.send(user);
  }
  else {
    // return new Error("Wrong password")
    return res.status(401).send("Wrong password");
  }
};

exports.getPatients = (req, res) => {
  if(req.user.clinicianId){
    return;
  }

  User.findAll({clinicianId: req.user.id}).then((datas) => {
    return res.status(200).send(datas);
  })
  .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error accessing the database!' });
    });
}


// Debugging methods
exports.findOne = (req, res) => {
  helper.findData(User, req, res);
}
exports.findAll = (req, res) => {
  helper.findAllData(User, req, res);
}

exports.updateHealthData = (req, res)=>{
  helper.updateHealthData(UserData, req, res);
}