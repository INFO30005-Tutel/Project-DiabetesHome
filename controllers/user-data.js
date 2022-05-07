const UserData = require('../models/user-data');

const getTodayData = async (patientId) => {
  let patientData = await UserData.findOne({ userId: patientId }).lean();

  patientData.bloodData = await helper.retrieveTodayData(patientData.bloodData);
  patientData.weightData = await helper.retrieveTodayData(
    patientData.weightData
  );
  patientData.insulinData = await helper.retrieveTodayData(
    patientData.insulinData
  );
  patientData.exerciseData = await helper.retrieveTodayData(
    patientData.exerciseData
  );

  return patientData;
};

module.exports = {
  getTodayData,
};
