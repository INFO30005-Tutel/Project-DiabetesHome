const handlebars = require('handlebars');
const controller = require('./delivery2-mock');

const mockPatientId = '6267f02b41463408a4205299';
const mockClinicianId = '6267ec216e7d25b724cac71d';

const patientMetadata = [
  {
    name: "Blood Glucose",
    units: "nmol/L",
    shortName: "glucose",
    iconImage: "/images/blood-glucose.svg"
  },
  {
    name: "Weight",
    units: "kg",
    shortName: "weight",
    iconImage: "/images/weight.svg"
  },
  {
    name: "Insulin Doses",
    units: "doses",
    shortName: "insulin",
    iconImage: "/images/insulin.svg"
  },
  {
    name: "Exercise",
    units: "steps",
    shortName: "exercise",
    iconImage: "/images/exercise.svg"
  }
]

// handle dashboard data
const getDashboardData = async (req, res) => {
  const patientId = req.params.patient_id;
  //console.log(await getPatientData(mockPatientId));
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
  let patientHasData
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
  try {
    patientHasData = await controller.getPatientHasData(patientId);
  } catch (err) {
    console.log(err);
  }

  console.log(patientUserData)

  patientDataList = [patientUserData.bloodData, patientUserData.weightData, patientUserData.insulinData, patientUserData.exerciseData]

  patient.dataEntries = []

  for (let i = 0; i < 4; i++) {
    // Clone the metadata
    let data = { ...patientMetadata[i]};
    // Add the data entry
    data.entry = patientDataList[i];
    data.required = patient.requiredFields.includes(i);
    data.exists = patientHasData[i];
    data.isDisabled = data.exists && !data.required;
    data.index = i;
    console.log(data.entry)
    // Add the entry to patient
    if (/*data.exists ||*/ data.required) {
      patient.dataEntries.push(data);
    }
}

  return patient;
};

module.exports = {
  getDashboardData,
};
