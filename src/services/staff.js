const connection = require('../database/connect');
const bcrypt = require('bcrypt');
const { generalAccessToken, generalRefreshToken, decodeToken } = require('./jwt');

const staffCheck = async (email) => {
  try {
    const [rows] = await (
      await connection
    ).execute('select * from person where email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};
const staffLogin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const staff = await staffCheck(data.email);
      if (staff === null) {
        resolve({
          status: 'ERR',
          message: 'The staff is not defined',
        });
      } else {
        const comparePass = await bcrypt.compareSync(data.password, staff.password);
        if (!comparePass) {
          resolve({
            status: 'ERR',
            message: 'Password error',
          });
        } else {
          const access_token = generalAccessToken({
            id: staff?.id,
            role: staff?.role_id,
          });

          const refresh_token = generalRefreshToken({
            id: staff?.id,
            role: staff?.role_id,
          });

          resolve({
            status: 'OK',
            message: 'Login success',
            access_token,
            refresh_token,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const fetchStaff = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decode = await decodeToken(token);
      const [staffDetails] = await (
        await connection
      ).execute(
        `select id, email, name, phone, address, day_birth, portrait, public_img_id, role_id, status_id from person where id = ? and role_id = ?`,
        [decode.data.id, decode.data.role]
      );
      if (decode) {
        resolve({
          status: 'OK',
          data: staffDetails[0],
        });
      } else {
        resolve({
          status: 'ERR',
          message: 'Err token',
        });
      }
    } catch (error) {
      console.log('Err Services.fetchStaff');
    }
  });
};

module.exports = { staffCheck, staffLogin, fetchStaff };
