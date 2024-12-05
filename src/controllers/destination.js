const DestinationService = require('../services/destination');

const getAllDestination = async (req, res) => {
  try {
    const result = await DestinationService.getAllDestination();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      status: 'ERR',
      message: 'ERR Controller Get All Destination',
    });
  }
};

module.exports = { getAllDestination };
