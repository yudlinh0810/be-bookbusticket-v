const moment = require('moment');
const connection = require('../database/connect');

const searchTrips = (departure, destination, day_departure) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `select trip.id, trip.name, 
                      departure.location as departure_location, 
                      destination.location as destination_location, 
                      trip.car_id, trip.day_departure
                   from trip 
                   inner join departure on trip.departure_id = departure.id
                   inner join destination on trip.destination_id = destination.id
                   where
                      trip.day_departure = ? and
                      departure.location = ? and
                      destination.location = ?
                   limit 10
                    `;
      const values = [
        moment(day_departure, 'DD/MM/YYYY').format('YYYY/MM/DD'),
        departure,
        destination,
      ];
      const [trips] = await (await connection).execute(sql, values);
      if (trips.length < 1) {
        resolve({
          status: 'OK',
          message: 'Trip not exist',
        });
      }
      resolve({
        status: 'OK',
        message: 'Search trip success',
        data: trips,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { searchTrips };
