const UserData = require('../models/user-data');

// Update a data identified by the data's Id =====================================
function updateData(controller, req, res) {
  // Get the id
  const id = req.params.id;

  // Case of updated sucessfully
  controller
    .findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
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
}

// Delete a data with the specified data's Id ====================================
function deleteData(controller, req, res) {
  const id = req.params.id;
  controller
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        // If no id found -> return error message
        return res
          .status(404)
          .send({ message: 'No data found to be deleted!' });
      }
      // Else, the data should be deleted successfully
      res.status(200).send({ message: 'Data is deleted successfully!' });
    })
    // Catching error when accessing the database
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error accessing the database!' });
    });
}

// Retrieve and return all data from the database =================================
function findAllData(controller, req, res) {
  // Return all data using find()
  controller
    .find()
    .then((data) => {
      res.send(data);
    })
    // Catching error when accessing the database
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error when accessing the database!' });
    });
}

// Retrieve and return data given the id =========================================
function findData(controller, req, res) {
  const id = req.params.id;
  // Return all data using findOne()
  controller
    .findOne({ id: id })
    .then((data) => {
      res.send(data);
    })
    // Catching error when accessing the database
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error when accessing the database!' });
    });
}

// Retrieve data from an array
function retrieveTodayData(dataArray) {
  var now = new Date();
  var todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var latestData = dataArray[dataArray.length - 1];
  //console.log(latestData);
  if (latestData && latestData.inputAt > todayDate) {
    return latestData;
  } else {
    return 0;
  }
}

module.exports = {
  updateData,
  deleteData,
  findAllData,
  findData,
  retrieveTodayData,
};
