const moment = require('moment');
const connection = require('../database/connect');

const searchTrips = (departure, destination, day_departure, price_arrangement) => {
  return new Promise(async (resolve, reject) => {
    try {
      let priceArranType = Number(price_arrangement) === 5 ? 'DESC' : 'ASC';

      const sql = `select trip.id, trip.trip_name, car.car_name, car.license_plate,
                      count(seat.id) as available_seat,
                      trip.hours_departure, trip.day_departure,
                      departure.location as departure_location, 
                      destination.location as destination_location, 
                      car.license_plate, trip.price
                   from trip 
                   inner join departure on trip.departure_id = departure.id
                   inner join destination on trip.destination_id = destination.id
                   inner join car on trip.car_id = car.id
                   inner join seat on trip.car_id = seat.car_id
                   where
                      trip.day_departure = ? and
                      departure.location = ? and
                      destination.location = ? and
                      seat.status_id = 'SS01'
                  group by
                      trip.id, trip.trip_name, car.car_name, car.license_plate, trip.day_departure,
                      trip.hours_departure, departure.location, destination.location, trip.price
                  order by price ${priceArranType}
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

const getAllTripSeat = (idTrip) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `select trip.id, trip.car_id as carId,seat.id as seatId, 
                   seat.position as seat_position, seat.type_id as seat_type,
                   seat.status_id as seat_status, trip.price
                   from trip
                   inner join car on trip.car_id = car.id
                   inner join seat on trip.car_id = seat.car_id
                   where trip.id = ?
                    `;
      const [rows] = await (await connection).execute(sql, [idTrip]);
      resolve({
        status: 'OK',
        message: 'Get all trip seat success',
        data: rows,
      });
    } catch (error) {
      console.log('err getAllTripSeat', error);
      reject(error);
    }
  });
};

module.exports = { searchTrips, getAllTripSeat };
