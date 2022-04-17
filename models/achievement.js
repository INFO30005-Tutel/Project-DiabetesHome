const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AchivementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    achived: [{
      badge:{
        type: mongoose.Schema.Types.ObjectId,
      },
      onDate: {
        type: Date,
      },
      engageRate:{
        type: Number,
      }
    }],
    totalEngagement: {
      type: Number,
    }
  }
);

module.exports = mongoose.model('Achivement', AchivementSchema);
