const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Id of patient only
    required: true,
  },
  requiredFields: [
    {
      type: Number,
    },
  ],
  bloodGlucoseLowThresh: { type: Number },
  bloodGlucoseHighThresh: { type: Number },

  weightLowThresh: { type: Number },
  weightHighThresh: { type: Number },

  insulinDoseLowThresh: { type: Number },
  insulinDoseHighThresh: { type: Number },

  stepCountLowThresh: { type: Number },
  stepCountHighThresh: { type: Number },
  bloodGlucoseData: [
    {
      value: { type: Number, required: true },
      note: { type: String },
      inputAt: { type: Date, required: true },
    },
  ],

  weightData: [
    {
      value: { type: Number, required: true },
      note: { type: String },
      inputAt: { type: Date, required: true },
    },
  ],
  insulinDoseData: [
    {
      value: { type: Number, required: true },
      note: { type: String },
      inputAt: { type: Date, required: true },
    },
  ],
  stepCountData: [
    {
      value: { type: Number, required: true },
      note: { type: String },
      inputAt: { type: Date, required: true },
    },
  ],
});

module.exports = mongoose.model('UserData', UserDataSchema);
