const TripService = require('../services/trip');

const searchTrip = async (req, res) => {
  try {
    const departure = decodeURIComponent(req.query.departure);
    const destination = decodeURIComponent(req.query.destination);
    const dayDeparture = decodeURIComponent(req.query.day_departure);
    const price_arrangement = req.query.price_arrangement;

    const dataSearchTrip = await TripService.searchTrips(
      departure,
      destination,
      dayDeparture,
      price_arrangement || 'ASC'
    );
    return res.status(200).json(dataSearchTrip);
  } catch (error) {
    console.log('err', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'Err Controller.searchTrip',
    });
  }
};

const getAllTripSeat = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await TripService.getAllTripSeat(id);
    return res.status(200).json(data);
  } catch (error) {
    console.log('err', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'Err Controller.getAllTripSeat',
    });
  }
};

module.exports = { searchTrip, getAllTripSeat };
