const express = require('express');
const router = express.Router();
const TripController = require('../controllers/trip');

router.get('/search-trips', TripController.searchTrip);

module.exports = router;
