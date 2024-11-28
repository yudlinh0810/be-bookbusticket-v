// add driver
// const moment = require('moment');
// const driverLicenseDate = moment(`27-11-2020`, 'DD/MM/YYYY').format('YYYY/MM/DD');
// const sql = `INSERT INTO driver (id, driver_license_receipt_date) VALUES (?, ?)`;
// const value = ['DRV01', driverLicenseDate];

// connection.execute(sql, value, (err, result) => {
//   if (err) {
//     throw err;
//   }
//   console.log(result);
// });

// get trip
// select trip.name, departure.location, destination.location, car.license_plate, seat.position
// from trip
// inner join departure
// on trip.departure_id = departure.id
// inner join destination
// on trip.destination_id = destination.id
// inner join car
// on trip.car_id = car.id
// inner join seat
// on seat.car_id = car.id
