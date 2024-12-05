const TripService = require('../services/trip');

const searchTrip = async (req, res) => {
  try {
    const departure = decodeURIComponent(req.query.departure);
    const destination = decodeURIComponent(req.query.destination);
    const dayDeparture = decodeURIComponent(req.query.day_departure);
    const dataSearchTrip = await TripService.searchTrips(departure, destination, dayDeparture);
    return res.status(200).json(dataSearchTrip);
  } catch (error) {
    return res.status(404).json({
      status: 'ERR',
      message: 'Err Controller.searchTrip',
    });
  }
};

module.exports = { searchTrip };
