const express = require('express');
const router = express.Router();
const TripController = require('../controllers/trip');

router.get('/search-trips', TripController.searchTrip);
router.get('/get-all-trip-seat/:id', TripController.getAllTripSeat);

module.exports = router;
