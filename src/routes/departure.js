const express = require('express');
const router = express.Router();
const ControllerDeparture = require('../controllers/departure');

router.get('/get-all-departure', ControllerDeparture.getAllDeparture);

module.exports = router;
