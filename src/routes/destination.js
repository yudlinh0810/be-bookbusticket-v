const express = require('express');
const router = express.Router();
const ControllerDestination = require('../controllers/destination');

router.get('/get-all-destination', ControllerDestination.getAllDestination);

module.exports = router;
