const connection = require('../database/connect');

const findDeparture = async (departure) => {
  try {
    const [rows] = await (
      await connection
    ).execute('select id from departure where location = ?', [departure]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

const getAllDeparture = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await (await connection).execute('select location from departure');
      resolve({
        status: 'OK',
        data: data[0],
      });
    } catch (error) {
      throw error;
    }
  });
};

module.exports = { findDeparture, getAllDeparture };
