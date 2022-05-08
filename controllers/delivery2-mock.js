const UserData = require('../models/user-data');
const User = require('../models/user');
const helper = require('./helper');

const mockPatientId = '6267f02b41463408a4205299';
const mockClinicianId = '6267ec216e7d25b724cac71d';

exports.mockLogin = (req, res) => {
  const { email, password } = req.body;
  console.warn('SIGN IN NOT IMPLEMENTED');
  console.debug('login email: ', email, ', password: ', password);
  const isPatient = true;
  if (isPatient) {
    const endpoint = '/patient/' + mockPatientId;
    res.redirect(endpoint);
  } else {
    const endpoint = '/clinician/' + mockClinicianId;
    res.redirect(endpoint);
  }
};

exports.mockSignUp = (req, res) => {
  console.warn('SIGN UP NOT IMPLEMENTED');
  const endpoint = '/clinician/' + mockClinicianId;
  res.redirect(endpoint);
};
