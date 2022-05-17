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

// exports.updateSelf = (req, res) => {
//   //console.log('updateSelf');
//   // Get the id
//   const id = req.user._id;

//   // Case of updated sucessfully
//   User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
//     .then((updatedData) => {
//       res.status(200).send(updatedData);
//     })
//     // Case of error
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({
//         message: 'Error when updating Data!',
//       });
//     });
// };

// // Delete this user and also his/her user-data block
// exports.delete = async (req, res) => {
//   const id = req.params.id;
//   User.findByIdAndDelete(id)
//     .then(async (data) => {
//       if (!data) {
//         // If no id found -> return error message
//         return res
//           .status(404)
//           .send({ message: 'No data found to be deleted!' });
//       }
//       // Else, continue to delete its user-data data block
//       await UserData.findByIdAndDelete({ userId: id }).then((userdata) => {
//         if (!userdata) {
//           res.status(500).send({ message: 'Missing userdata for this user!' });
//         }
//       });
//       res.status(200).send({ message: 'Data is deleted successfully!' });
//     })
//     // Catching error when accessing the database
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({ message: 'Error accessing the database!' });
//     });
// };

// exports.changePassword = async (req, res) => {
//   if (!req.user) {
//     return console.error();
//   }

//   console.log(req.body);

//   let user = await User.findOne({ email: req.user.email });

//   if (user.verifyPassword(req.body.oldPassword)) {
//     user.password = user.hashPassword(req.body.newPassword);

//     await user.save();
//     res.send(user);
//   } else {
//     // return new Error("Wrong password")
//     return res.status(401).send('Wrong password');
//   }
// };

module.exports = {
  getPersonalInfo,
};
