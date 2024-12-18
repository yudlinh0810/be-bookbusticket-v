const CarService = require('../services/car');

const updateCar = async (req, res) => {
  try {
    const updateData = JSON.parse(req.body.data);
    const imageURL = req?.file?.cloudinaryURL || null;
    const publicImg = req?.file?.cloudinaryPublic || null;
    console.log('data', updateData);
    console.log('imgUrl', imageURL);
    console.log('publicImg', publicImg);
    const data = await CarService.updateCar(updateData, imageURL, publicImg);
    res.status(200).json(data);
  } catch (error) {
    console.log('Controller', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.updateCar',
    });
  }
};

const deleteCar = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await CarService.deleteCar(id);
    res.status(200).json(data);
  } catch (error) {
    console.log('Controller', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.deleteCar',
    });
  }
};

const getAllCar = async (req, res) => {
  try {
    const data = await CarService.getAllCar();
    res.status(200).json(data);
  } catch (error) {
    console.log('Controller', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.getAllCar',
    });
  }
};

const createCar = async (req, res) => {
  try {
    const newCar = JSON.parse(req.body.data);
    const imageURL = req?.file?.cloudinaryURL || null;
    const publicImg = req?.file?.cloudinaryPublic || null;
    const data = await CarService.createCar(newCar, imageURL, publicImg);
    res.status(200).json(data);
  } catch (error) {
    console.log('Controller', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.createCar',
    });
  }
};

module.exports = { getAllCar, createCar, updateCar, deleteCar };
