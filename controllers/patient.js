const handlebars = require('handlebars');
const controller = require('./delivery2-mock');

const mockPatientId = '6267f02b41463408a4205299';
const mockClinicianId = '6267ec216e7d25b724cac71d';

const patientMetadata = [
  {
    number: 0,
    name: "Blood Glucose",
    units: "nmol/L",
    shortName: "glucose",
    iconImage: "/images/Blood-glucose.png"
  },
  {
    number: 1,
    name: "Insulin Doses",
    units: "doses",
    shortName: "insulin",
    iconImage: "/images/Insulin-input.png"
  },
  {
    number: 2,
    name: "Exercise",
    units: "steps",
    shortName: "exercise",
    iconImage: "/images/Exercise-input.png"
  },
  {
    number: 3,
    name: "Weight",
    units: "kg",
    shortName: "weight",
    iconImage: "/images/Weight-input.png"
  }
]

// handle dashboard data
const getDashboardData = async (req, res) => {
  const patientId = req.params.patient_id;
  let patientName = 'Pat Sadguy';
  console.log(await getPatientData(mockPatientId));
  res.render('patient/patient-dashboard.hbs', {
    layout: 'patient-layout.hbs',
    userId: req.params.patient_id,
    userData: await getPatientData(mockPatientId),
    metadata: patientMetadata
  });
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
