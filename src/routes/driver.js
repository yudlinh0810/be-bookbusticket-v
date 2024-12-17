const express = require('express');
const router = express.Router();
const DriverController = require('../controllers/driver');
const uploadImageMiddleware = require('../middleware/middlewares');

router.get('/get-all-driver', DriverController.getAllDriver);
router.post('/create-driver', DriverController.createDriver);
router.post('/update-driver', uploadImageMiddleware, DriverController.updateDriver);
router.delete('/delete-driver/:id', DriverController.deleteDriver);

module.exports = router;
