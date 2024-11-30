const connection = require('../database/connect');
const bcrypt = require('bcrypt');
const { generalAccessToken, generalRefreshToken } = require('./jwt');

const checkUser = async (email) => {
  try {
    const [rows] = await (await connection).query('select * from person where email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

const countCustomer = async () => {
  try {
    const query = 'select count(*) from customer';
    const [rows] = await (await connection).query(query);
    const result = rows[0]['count(*)'];
    return result;
  } catch (error) {
    throw error;
  }
};

const register = (newCustomer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = newCustomer;

      const checkPerson = await checkUser(email);
      if (checkPerson) {
        return resolve({
          status: 'ERR',
          message: 'This user already exists',
        });
      }

      const count = await countCustomer();

      const passwordHash = bcrypt.hashSync(password, 10);

      const userId = count < 9 ? `CTM0${count + 1}` : `CTM${count + 1}`;

      const sqlPerson = `INSERT INTO person (id, email, password, role_id, status_id) VALUES (?, ?, ?, ?, ?)`;
      const values = [userId, email, passwordHash, 'CTM', 'PS01'];

      (await connection).query(sqlPerson, values);

      const sqlCustomer = `INSERT INTO customer (id) VALUES (?)`;

      (await connection).query(sqlCustomer, [userId]);

      const newUser = await checkUser(email);
      if (newUser) {
        const access_token = generalAccessToken({ id: newUser.id, role: newUser.role });
        const refresh_token = generalRefreshToken({ id: newUser.id, role: newUser.role });

        return resolve({
          status: 'OK',
          message: 'Register success',
          data: newCustomer,
          access_token,
          refresh_token,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const login = (customerLogin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPerson = await checkUser(customerLogin.email);
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

module.exports = { login, checkUser, countCustomer, register };
