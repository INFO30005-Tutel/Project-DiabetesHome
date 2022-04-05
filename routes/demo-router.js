const express = require('express');
// create our Router object
const demoRouter = express.Router();
// import demo controller functions
const demoController = require('../controllers/demo-controller');
// add a route to handle the GET request for all demo data
demoRouter.get('/', demoController.getAllDemoData);
// export the router
module.exports = demoRouter;
