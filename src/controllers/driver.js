const DriverServices = require('../services/driver');

const getAllDriver = async (req, res) => {
  try {
    const data = await DriverServices.getAllDriver();
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.log('err get all driver.controller', error);
    return res.status(400).json({
      status: 'ERR',
      message: 'Err GetAllDriver.controller',
    });
  }
};

const createDriver = async (req, res) => {
  try {
    const newCustomer = req.body;
    const data = await DriverServices.createDriver(newCustomer);
    res.status(200).json(data);
  } catch (error) {
    console.log('Controller', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.createDriver',
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const updateData = req.body;
    const imageURL = req?.file?.cloudinaryURL || null;
    const publicImg = req?.file?.cloudinaryPublic || null;
    const data = await DriverServices.updateDriver(updateData, imageURL, publicImg);
    res.status(200).json(data);
  } catch (error) {
    console.log('Controller', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.updateDriver',
    });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await DriverServices.deleteDriver(id);
    res.status(200).json(data);
  } catch (error) {
    console.log('Controller', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.deleteDriver',
    });
  }
};

module.exports = { getAllDriver, createDriver, updateDriver, deleteDriver };
