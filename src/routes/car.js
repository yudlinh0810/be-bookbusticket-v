const CarController = require('../controllers/car');
const express = require('express');
const uploadImageMiddleware = require('../middleware/middlewares');
const router = express.Router();

router.get('/get-all-car', CarController.getAllCar);
router.post('/create-car', uploadImageMiddleware.carUploadImageMiddleware, CarController.createCar);
router.post('/update-car', uploadImageMiddleware.carUploadImageMiddleware, CarController.updateCar);
router.delete('/delete-car/:id', CarController.deleteCar);

module.exports = router;
