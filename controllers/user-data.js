const UserData = require('../models/user-data');
const Helper = require('../controllers/Helper');

const getTodayData = async (patientId) => {
  let patientData = await UserData.findOne({ userId: patientId }).lean();
  //console.log(patientData);
  patientData.bloodGlucoseData = await Helper.retrieveTodayData(patientData.bloodGlucoseData);
  patientData.weightData = await Helper.retrieveTodayData(patientData.weightData);
  patientData.insulinDoseData = await Helper.retrieveTodayData(patientData.insulinDoseData);
  patientData.stepCountData = await Helper.retrieveTodayData(patientData.stepCountData);

  return patientData;
};

const updateUserDataMeasurement = async (req, res) => {
  let savedData;
  await UserData.findOne({ userId: req.user._id }).then(async (data) => {
    if (data) {
      savedData = JSON.parse(JSON.stringify(data));
    }
  });

  let input = {
    value: req.body.value,
    note: req.body.note,
    inputAt: new Date(),
  };
  let now = new Date();
  let todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let last;
  let n;
  if (req.body.type == 0) {
    n = savedData.bloodGlucoseData.length;
    last = savedData.bloodGlucoseData[n - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.bloodGlucoseData[n - 1] = input;
    } else {
      savedData.bloodGlucoseData.push(input);
    }
  }
  if (req.body.type == 1) {
    n = savedData.weightData.length;
    last = savedData.weightData[n - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.weightData[n - 1] = input;
    } else {
      savedData.weightData.push(input);
    }
  }
  if (req.body.type == 2) {
    n = savedData.insulinDoseData.length;
    last = savedData.insulinDoseData[n - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.insulinDoseData[n - 1] = input;
    } else {
      savedData.insulinDoseData.push(input);
    }
  }
  if (req.body.type == 3) {
    n = savedData.stepCountData.length;
    last = savedData.stepCountData[n - 1];
    if (last && new Date(last.inputAt).getTime() > todayDate.getTime()) {
      // Override last entry
      savedData.stepCountData[n - 1] = input;
    } else {
      savedData.stepCountData.push(input);
    }
  }

  let id = savedData._id;
  delete savedData._id;
  // Now update data
  await UserData.findByIdAndUpdate(id, { $set: savedData })
    .then((updatedData) => {
      if (updatedData) {
        res.redirect(`/patient`);
      }
    })
    // Case of error
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: 'Error when updating Data!',
      });
    });
};

// Change what measurement patient need to record, along with their threshold
// req.body = {
//   bloodLow: '3.8',
//   bloodHigh: '5.6',
//   weightLow: '80',
//   weightHigh: '100',
//   insulinLow: '0',
//   insulinHigh: '2',
//   stepLow: '1000',
//   stepHigh: '4000'
// }
const changePatientRecordParameter = async (req, res) => {
  let newParams = {
    bloodGlucoseLowThresh: req.body.bloodLow,
    bloodGlucoseHighThresh: req.body.bloodHigh,
    weightLowThresh: req.body.weightLow,
    weightHighThresh: req.body.weightHigh,
    insulinDoseLowThresh: req.body.insulinLow,
    insulinDoseHighThresh: req.body.insulinHigh,
    stepCountLowThresh: req.body.stepLow,
    stepCountHighThresh: req.body.stepHigh,
  };
  let patientData;
  //console.log(req.body);

  try {
    patientData = await UserData.findOne({ _id: req.params.id }).lean();
  } catch (err) {
    console.log(err);
  }
  try {
    patientData = await UserData.findByIdAndUpdate(
      patientData._id,
      { $set: newParams },
      { new: true }
    ).lean();
  } catch (err) {
    console.log(err);
  }

  if (patientData) return true;

  return false;
};

// Rechieve and format threshold for rendering
const getThresholds = async (patId, defaultDangerThreshold) => {
  let patientData = await UserData.findOne({ userId: patId }).lean();

  const bloodThres = Helper.formatThreshold(
    'blood',
    'Blood glucose level',
    patientData.bloodGlucoseLowThresh,
    patientData.bloodGlucoseHighThresh,
    'mmol/L',
    defaultDangerThreshold[0],
    defaultDangerThreshold[1]
  );
  bloodThres.required = patientData.requiredFields.includes(0);

  const weightThres = Helper.formatThreshold(
    'weight',
    'Weight entry',
    patientData.weightLowThresh,
    patientData.weightHighThresh,
    'kg',
    defaultDangerThreshold[2],
    defaultDangerThreshold[3]
  );
  weightThres.required = patientData.requiredFields.includes(1);

  const insulinThres = Helper.formatThreshold(
    'insulin',
    'Dose of insulin taken per day',
    patientData.insulinDoseLowThresh,
    patientData.insulinDoseHighThresh,
    'doses',
    defaultDangerThreshold[4],
    defaultDangerThreshold[5]
  );
  insulinThres.required = patientData.requiredFields.includes(2);

  const stepCountThres = Helper.formatThreshold(
    'step',
    'Step count recommended',
    patientData.stepCountLowThresh,
    patientData.stepCountHighThresh,
    'steps',
    defaultDangerThreshold[6],
    defaultDangerThreshold[7]
  );
  stepCountThres.required = patientData.requiredFields.includes(3);
  return [bloodThres, weightThres, insulinThres, stepCountThres];
};

const getOverviewData = async (patId) => {
  const dataBlock = await UserData.findOne({ userId: patId }).lean();

  const bloodData = await extractOverviewData(dataBlock.bloodGlucoseData, 0);
  const weightData = await extractOverviewData(dataBlock.weightData, 1);
  const insulinData = await extractOverviewData(dataBlock.insulinDoseData, 2);
  const stepData = await extractOverviewData(dataBlock.stepCountData, 3);

  return [
    { id: 'overview-blood', dataName: 'BLOOD GLUCOSE LEVEL', data: JSON.stringify(bloodData) },
    { id: 'overview-weight', dataName: 'WEIGHT ENTRY PER DAY', data: JSON.stringify(weightData) },
    {
      id: 'overview-insulin',
      dataName: 'INSULIN TAKEN PER DAY',
      data: JSON.stringify(insulinData),
    },
    { id: 'overview-step', dataName: 'WALKING STEP COUNT PER DAY', data: JSON.stringify(stepData) },
  ];
};

const getDetailedData = async (patId) => {
  const dataBlock = await UserData.findOne({ userId: patId }).lean();

  const bloodData = await extractDetailedData(dataBlock.bloodGlucoseData);
  const weightData = await extractDetailedData(dataBlock.weightData);
  const insulinData = await extractDetailedData(dataBlock.insulinDoseData);
  const stepData = await extractDetailedData(dataBlock.stepCountData);

  return [
    { id: 'detailed-blood', dataName: 'BLOOD GLUCOSE LEVEL', data: bloodData, unit: '(mmol/L)' },
    { id: 'detailed-weight', dataName: 'WEIGHT ENTRY', data: weightData, unit: '(kg)' },
    { id: 'detailed-insulin', dataName: 'INSULIN TAKEN', data: insulinData, unit: '(doses)' },
    { id: 'detailed-step', dataName: 'WALKING STEP COUNT', data: stepData, unit: '(steps)' },
  ];
};

// Extract data for overview render
const extractOverviewData = async (dataList, dataIndex) => {
  const range = 7; // overview of the nearest 7 days
  let extractedData = [];
  const colStyle = await getDataColStyle(dataIndex);

  if (!dataList) dataList = [];

  for (let i = 0; i < range; i++) {
    let index = dataList.length - i - 1;
    if (index < 0) {
      extractedData.unshift({
        x: 'no record',
        value: 0,
        normal: colStyle,
      });
      break;
    } else {
      const dateTime = Helper.getDateAndTime(dataList[index].inputAt);
      extractedData.unshift({
        x: dateTime.date,
        value: dataList[index].value,
        normal: colStyle,
      });
    }
  }

  return extractedData;
};

// Extract data for overview render
const extractDetailedData = async (dataList) => {
  const range = 30; // Asume to show 20 days
  let extractedData = [];

  if (!dataList) dataList = [];

  for (let i = 0; i < range; i++) {
    let index = dataList.length - i - 1;
    if (index < 0) {
      extractedData.push({
        timestamp: 'No record',
        value: 0,
        note: '',
      });
    } else {
      const dateTime = Helper.getDateAndTime(dataList[index].inputAt);
      extractedData.push({
        timestamp: dateTime.date + ' - ' + dateTime.time,
        value: dataList[index].value,
        note: dataList[index].note,
      });
    }
  }

  return extractedData;
};

// Get color and styling for rendering diagram
const getDataColStyle = async (dataIndex) => {
  let stroke = null;
  let label = { enabled: true };
  let fill;
  // blood
  if (dataIndex == 0) fill = '#FF5F6D';
  // weight
  if (dataIndex == 1) fill = '#5FA4FF';
  // insulin
  if (dataIndex == 2) fill = '#CAA119';
  // step
  if (dataIndex == 3) fill = '#55B24F';

  return {
    fill: fill,
    stroke: stroke,
    label: label,
  };
};

module.exports = {
  getTodayData,
  updateUserDataMeasurement,
  changePatientRecordParameter,
  getThresholds,
  getDetailedData,
  getOverviewData,
};
