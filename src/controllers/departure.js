const DepartureService = require('../services/departure');

const getAllDeparture = async (req, res) => {
  try {
    const result = await DepartureService.getAllDeparture();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      status: 'ERR',
      message: 'ERR Controller Get All Departure',
    });
  }
};

module.exports = { getAllDeparture };
