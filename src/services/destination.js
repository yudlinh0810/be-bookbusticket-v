const connection = require('../database/connect');

const findDestination = async (destination) => {
  try {
    const [rows] = await (
      await connection
    ).execute('select id from destination where location = ?', [destination]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

const getAllDestination = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await (await connection).execute('select location from destination');
      resolve({
        status: 'OK',
        data: data[0],
      });
    } catch (error) {
      throw error;
    }
  });
};

module.exports = { findDestination, getAllDestination };
