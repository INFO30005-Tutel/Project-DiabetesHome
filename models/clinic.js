const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
    },
    bio: {
      type: String,     
    },
    slogan: {
      type: String,      
    },
    // logo: {
    //   type: String,      
    // },
    // 
  }
);

module.exports = mongoose.model('Clinic', ClinicSchema);
