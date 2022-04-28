const handlebars = require('handlebars');
const controller = require('./delivery2-mock');

const mockPatientId = '6267f02b41463408a4205299';
const mockClinicianId = '6267ec216e7d25b724cac71d';

// handle dashboard data
const getDashboardData = async (req, res) => {
  const patientId = req.params.patient_id;
  let patientName = 'Pat Sadguy';
  console.log(await getPatientData(mockPatientId));
  res.render('patient/patient-dashboard.hbs', { layout: 'patient-layout.hbs' });
};

const getPatientData = async (patientId) => {
  let patient;
  let patientUserData;
  try {
    patient = await controller.getUser(patientId);
  } catch (err) {
    console.log(err);
  }
  try {
    patientUserData = await controller.getTodayData(patientId);
  } catch (err) {
    console.log(err);
  }

  // Add `required` value to fields that patient need to update
  patient.bloodGlucose = patientUserData.bloodData || {};
  if (patient.requiredFields.includes(0)) patient.bloodGlucose.required = true;
  patient.weight = patientUserData.weightData || {};
  if (patient.requiredFields.includes(1)) patient.weight.required = true;
  patient.insulinDoses = patientUserData.insulinData || {};
  if (patient.requiredFields.includes(2)) patient.insulinDoses.required = true;
  patient.stepCounts = patientUserData.exerciseData || {};
  if (patient.requiredFields.includes(3)) patient.stepCounts.required = true;

  return patient;
};

module.exports = {
  getDashboardData,
};
