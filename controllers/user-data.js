const UserData = require('../models/user-data');
const helper = require('../controllers/helper');

const getTodayData = async (patientId) => {
  let patientData = await UserData.findOne({ userId: patientId }).lean();
  console.log(patientData);

  patientData.bloodGlucoseData = await helper.retrieveTodayData(
    patientData.bloodGlucoseData
  );
  patientData.weightData = await helper.retrieveTodayData(
    patientData.weightData
  );
  patientData.insulinDoseData = await helper.retrieveTodayData(
    patientData.insulinDoseData
  );
  patientData.stepCountData = await helper.retrieveTodayData(
    patientData.stepCountData
  );

  return patientData;
};

module.exports = {
  getTodayData,
};
