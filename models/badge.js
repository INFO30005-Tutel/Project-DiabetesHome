const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BadgeSchema = new mongoose.Schema({
  name:{
    type: String,
  },
});

module.exports = mongoose.model('Badge', BadgeSchema);
