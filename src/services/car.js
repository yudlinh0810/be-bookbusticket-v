const connection = require('../database/connect');
const bcrypt = require('bcrypt');

const carCheck = async (licensePlate) => {
  try {
    const [rows] = await (
      await connection
    ).execute(
      `select id, car_name, phone, license_plate, image, public_img_id, status, type, number_of_seat, year_of_manufacture
               from car
               where license_plate = ?`,
      [licensePlate]
    );
    console.log('rows', rows[0]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

const countCar = async () => {
  try {
    const query = 'select count(*) from car';
    const [rows] = await (await connection).execute(query);
    const result = rows[0]['count(*)'];
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllCar = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [carList] = await (
        await connection
      ).execute(`select car.id, car.car_name, count(seat.id) as seat_count,
                  car.phone, car.license_plate, car.image, car.public_img_id, car.status, car.type, car.year_of_manufacture
                  from car
                  inner join seat on car.id = seat.car_id
                  group by car.id, car.car_name, car.phone, 
                           car.license_plate, car.image, car.public_img_id, car.status, car.type 
                  `);
      if (!carList[0]) {
        resolve({
          status: 'OK',
          message: 'Err get all car',
        });
      } else {
        resolve({
          status: 'OK',
          message: 'Get all car success',
          data: carList,
        });
      }
    } catch (error) {
      console.log('err getall car');
      reject(error);
    }
  });
};

const createCar = (newCar, img, publicImg) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('newCar', newCar);
      const checkCar = await carCheck(newCar.licensePlate);
      if (checkCar) {
        resolve({
          status: 'ERR',
          message: 'The Car already exist',
        });
      }
      const [day, month, year] = newCar.yearOfManufacture.split('/');
      const yearSQL = year + '-' + month + '-' + day;
      console.log('year', yearSQL);
      const count = await countCar();
      console.log('count', count);
      const carId = count < 9 ? `C0${count + 1}` : `C${count + 1}`;
      const sqlCar = `INSERT INTO car (id, car_name, phone, license_plate, image, public_img_id, status, 
                         type, number_of_seat, year_of_manufacture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        carId,
        newCar.name,
        newCar.phone,
        newCar.licensePlate,
        img,
        publicImg,
        newCar.status,
        newCar.type,
        newCar.numberOfSeats,
        yearSQL,
      ];
      await (await connection).query(sqlCar, values);
      const car = await carCheck(newCar.licensePlate);
      let i = 1;
      while (i <= Number(newCar.numberOfSeats)) {
        await (
          await connection
        ).execute(
          `insert into seat (id, position, type_id, car_id, status_id)
                                         values(?, ?, ?, ?, ?)`,
          [i < 9 ? `S${carId}0` + i : `S${carId}` + i, `A${i}`, 'ST01', carId, 'SS01']
        );
        i++;
      }
      if (car) {
        return resolve({
          status: 'OK',
          message: 'Create Driver success',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateCar = (carUpdate, image, publicImg) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [day, month, year] = carUpdate.year_of_manufacture.split('/');
      const yearSQL = year + '-' + month + '-' + day;
      if (image === null || publicImg === null) {
        const sql = `update car set car_name = ?, phone = ?, license_plate = ?, number_of_seat = ?,
                     year_of_manufacture = ?, status = ?, type = ? 
                     where id = ?`;
        const updateValue = [
          carUpdate.car_name || null,
          carUpdate.phone || null,
          carUpdate.license_plate || null,
          carUpdate.seat_count || null,
          yearSQL || null,
          carUpdate.status || null,
          carUpdate.type || null,
          carUpdate.id || null,
        ];
        await (await connection).execute(sql, updateValue);
      } else {
        const sql = `update car set car_name = ?, phone = ?, license_plate = ?, number_of_seat = ?, image = ?, 
                     public_img_id = ?, year_of_manufacture = ?, status = ?, type = ? 
                     where id = ?`;
        const updateValue = [
          carUpdate.car_name || null,
          carUpdate.phone || null,
          carUpdate.license_plate || null,
          carUpdate.seat_count || null,
          image,
          publicImg,
          yearSQL || null,
          carUpdate.status || null,
          carUpdate.type || null,
          carUpdate.id || null,
        ];
        await (await connection).execute(sql, updateValue);
      }
      await (await connection).execute('delete from seat where car_id = ?', [carUpdate.id]);
      let i = 1;
      while (i <= Number(carUpdate.seat_count)) {
        await (
          await connection
        ).execute(
          `insert into seat (id, position, type_id, car_id, status_id)
                                         values(?, ?, ?, ?, ?)`,
          [`S${carUpdate.id}` + i, `A${i}`, 'ST01', carUpdate.id, 'SS01']
        );
        i++;
      }
      resolve({
        status: 'OK',
        message: 'Update car success',
      });
    } catch (error) {
      console.log('err', error);
      reject(error);
    }
  });
};

const deleteCar = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const seatDelete = await (
        await connection
      ).execute('delete from seat where car_id = ?', [id]);
      const carDelete = await (await connection).execute('delete from car where id = ?', [id]);
      console.log('car delete', carDelete);
      resolve({
        status: 'OK',
        message: 'Delete Driver success',
      });
    } catch (error) {
      console.log('Err Service.delete', error);
    }
  });
};

module.exports = { carCheck, getAllCar, createCar, updateCar, deleteCar };
