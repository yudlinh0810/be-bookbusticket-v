const connection = require('../database/connect');
const bcrypt = require('bcrypt');

const insertOtp = ({ otp, email, passwordHash, name }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(otp, salt);

      const query = 'insert into otp (email, otp, password, name, time) values(?, ?, ?, ?, NOW())';
      const newOtp = await (
        await connection
      ).execute(query, [email, hash, passwordHash, name], (err, result) => {
        if (err) {
          console.log('ErrError when adding OTP', err);
        }
        console.log(result);
      });
      resolve({
        data: newOtp,
      });
    } catch (error) {
      console.log('ERR Insert OTP', error);
      reject(error);
    }
  });
};
const isValidOtp = async (otp, hashOtp) => {
  try {
    const isValid = await bcrypt.compare(otp, hashOtp);
    return isValid;
  } catch (error) {
    console.error(error);
  }
};

const findOtp = async (email) => {
  try {
    const [rowsCount] = await (
      await connection
    ).execute('select count(otp) from otp where email = ?', [email]);

    const length = rowsCount[0]['count(otp)'];
    console.log('length', length);

    const [rows] = await (
      await connection
    ).execute('select email, name, password, otp from otp where email = ?', [email]);
    console.log(rows[length - 1]);
    return rows.length > 0 ? rows[length - 1] : null;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertOtp,
  isValidOtp,
  findOtp,
};
