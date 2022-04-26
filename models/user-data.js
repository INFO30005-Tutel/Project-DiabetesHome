const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Id of patient only
    required: true,
  },
  bloodData: [
    {
      data: {
        type: Number,
      },
      inputAt: {
        type: Date,
      },
    },
  ],
  weightData: [
    {
      data: {
        type: Number,
      },
      inputAt: {
        type: Date,
      },
    },
  ],
  insulinData: [
    {
      data: {
        type: Number,
      },
      inputAt: {
        type: Date,
      },
    },
  ],
  exerciseData: [
    {
      data: {
        type: Number,
      },
      inputAt: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model('UserData', UserDataSchema);
