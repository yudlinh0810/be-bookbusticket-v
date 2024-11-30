const connection = require('../database/connect');
const bcrypt = require('bcrypt');
const { generalAccessToken, generalRefreshToken } = require('./jwt');

const checkUser = async (email) => {
  try {
    const [rows] = await (await connection).query('select * from person where email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;
  }
};

const login = (customerLogin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPerson = await checkUser(customerLogin.email);
      console.log('checkPerson', checkPerson);
      if (checkPerson === null) {
        resolve({
          status: 'ERR',
          message: 'The user is not defined',
        });
      } else {
        const comparePass = await bcrypt.compareSync(customerLogin.password, checkPerson.password);
        if (!comparePass) {
          resolve({
            status: 'ERR',
            message: 'Password error',
          });
        } else {
          const access_token = generalAccessToken({
            id: checkPerson?.id,
            role: checkPerson?.role,
          });

          const refresh_token = generalRefreshToken({
            id: checkPerson?.id,
            role: checkPerson?.role,
          });
          console.log('Access token:', access_token); // In ra access token để kiểm tra
          console.log('Refresh token:', refresh_token);
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

module.exports = { login, checkUser };
