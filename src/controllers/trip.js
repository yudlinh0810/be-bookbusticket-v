const TripService = require('../services/trip');

const searchTrip = async (req, res) => {
  try {
    const { departure, destination, day_departure } = req.query;
    const dataSearchTrip = await TripService.searchTrips(departure, destination, day_departure);
    return res.status(200).json(dataSearchTrip);
  } catch (error) {
    console.log('Err Controller.searchTrip', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'Err Controller.searchTrip',
    });
  }
};

module.exports = { searchTrip };
