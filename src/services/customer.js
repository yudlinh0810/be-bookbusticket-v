const connection = require('../database/connect');
const bcrypt = require('bcrypt');
const { generalAccessToken, generalRefreshToken, decodeToken } = require('./jwt');
const otpGenerator = require('otp-generator');
const { insertOtp, isValidOtp, findOtp } = require('./otp');
const { sendOtpEmail } = require('./email');
const { getDetail } = require('./userService');

const checkUser = async (email) => {
  try {
    const [rows] = await (
      await connection
    ).execute('select * from person where email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

const countCustomer = async () => {
  try {
    const query = 'select count(*) from customer';
    const [rows] = await (await connection).execute(query);
    const result = rows[0]['count(*)'];
    return result;
  } catch (error) {
    throw error;
  }
};

const register = (newCustomer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password, name } = newCustomer;

      const checkPerson = await checkUser(email);
      if (checkPerson) {
        return resolve({
          status: 'ERR',
          message: 'This user already exists',
        });
      }

      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const passwordHash = await bcrypt.hash(password, 10);
      await insertOtp({ otp, email, passwordHash, name });
      await sendOtpEmail({ email, otp });

      resolve({
        status: 'OK',
        message: 'Create OTP success',
      });
    } catch (error) {
      reject(error);
    }
  });
};

const verifyEmail = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOtp = await findOtp(email);
      console.log('checkOTP', checkOtp);
      if (!checkOtp) {
        resolve({
          status: 'ERR',
          message: 'The otp code for this email does not exist',
        });
      }

      const isValid = await isValidOtp(otp, checkOtp.otp);

      if (!isValid) {
        resolve({
          status: 'ERR',
          message: 'Err Verify mail ',
        });
      }

      if (isValid && email === checkOtp.email) {
        const count = await countCustomer();

        const userId = count < 9 ? `CTM0${count + 1}` : `CTM${count + 1}`;
        const sqlPerson = `INSERT INTO person (id, email, name, password, role_id, status_id) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [userId, checkOtp.email, checkOtp.name, checkOtp.password, 'CTM', 'PS01'];

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

const getDetailCustomer = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await decodeToken(token);
      const id = user.data.id;
      const detail = await getDetail(id);
      resolve({
        status: 'OK',
        data: detail,
      });
    } catch (error) {
      console.log('Err Service.getDetail', error);
    }
  });
};

const updateCustomer = (update, image, publicImg) => {
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

module.exports = {
  login,
  checkUser,
  countCustomer,
  register,
  verifyEmail,
  getDetailCustomer,
  updateCustomer,
};
