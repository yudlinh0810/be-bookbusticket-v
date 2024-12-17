const connection = require('../database/connect');
const bcrypt = require('bcrypt');

const driverCheck = async (email) => {
  try {
    const [rows] = await (
      await connection
    ).execute(
      `select person.email, person.password, person.name, person.portrait, person.address, person.day_birth, 
               person.public_img_id, driver.driver_license_receipt_date, person.role_id, person.status_id 
               from person
               inner join driver on person.id = driver.id
               where email = ?`,
      [email]
    );
    console.log('rows', rows[0]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

const countDriver = async () => {
  try {
    const query = 'select count(*) from driver';
    const [rows] = await (await connection).execute(query);
    const result = rows[0]['count(*)'];
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllDriver = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [driverList] = await (
        await connection
      )
        .execute(`select person.id, person.email, person.name, person.phone, person.portrait, person.address, person.day_birth, 
               person.public_img_id, driver.driver_license_receipt_date, person.role_id, person.status_id 
               from person
               inner join driver on person.id = driver.id`);
      if (!driverList[0]) {
        resolve({
          status: 'OK',
          message: 'Err get all driver',
        });
      } else {
        resolve({
          status: 'OK',
          message: 'Get all driver success',
          data: driverList,
        });
      }
    } catch (error) {
      console.log('err getall driver');
      reject(error);
    }
  });
};

const createDriver = (newDriver) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkDriver = await driverCheck(newDriver.email);
      console.log('driver', checkDriver);
      if (checkDriver) {
        resolve({
          status: 'ERR',
          message: 'The Driver already exist',
        });
      }

      const hashPass = await bcrypt.hash(newDriver.password, 10);
      const count = await countDriver();
      const userId = count < 9 ? `DRV0${count + 1}` : `DRV${count + 1}`;
      const sqlPerson = `INSERT INTO person (id, email, name, phone, password, role_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        userId,
        newDriver.email,
        newDriver.name,
        newDriver.phone,
        hashPass,
        'DRV',
        'PS01',
      ];

      (await connection).query(sqlPerson, values);

      const sqlDriver = `INSERT INTO driver (id) VALUES (?)`;

      (await connection).query(sqlDriver, [userId]);
      console.log('276');
      const newUser = await driverCheck(newDriver.email);
      if (newUser) {
        console.log('289');
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

const updateDriver = (update, image, publicImg) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parseData = JSON.parse(update.data);
      if (image === null || publicImg === null) {
        const sql = 'update person set name = ?, phone = ?,address = ?, day_birth = ? where id = ?';
        const updateValue = [
          parseData.name || null,
          parseData.phone || null,
          parseData.address || null,
          parseData.day_birth || null,
          parseData.id || null,
        ];
        await (await connection).execute(sql, updateValue);
      } else {
        const sql =
          'update person set name = ?, phone = ?, portrait = ?, public_img_id = ?, address = ?, day_birth = ? where id = ?';
        const updateValue = [
          parseData.name || null,
          parseData.phone || null,
          image || null,
          publicImg || null,
          parseData.address || null,
          parseData.day_birth || null,
          parseData.id || null,
        ];
        await (await connection).execute(sql, updateValue);
      }
      resolve({
        status: 'OK',
        message: 'Update user success',
      });
    } catch (error) {
      console.log('err', error);
      reject(error);
    }
  });
};

const deleteDriver = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const personDelete = (await connection).execute('delete from person where id = ?', [id]);
      const DriverDelete = (await connection).execute('delete from driver where id = ?', [id]);
      console.log('first', personDelete);
      console.log('second', DriverDelete);
      resolve({
        status: 'OK',
        message: 'Delete Driver success',
      });
    } catch (error) {
      console.log('Err Service.delete', error);
    }
  });
};

module.exports = { driverCheck, getAllDriver, createDriver, updateDriver, deleteDriver };
