const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { ProvidePlugin } = require('webpack');

const generalAccessToken = (payload) => {
  const { id, role } = payload;
  const access_token = jwt.sign(
    {
      id,
      role,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: '365d' }
  );
  return access_token;
};

const generalRefreshToken = (payload) => {
  const { id, role } = payload;
  const refresh_token = jwt.sign(
    {
      id,
      role,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: '365d' }
  );
  return refresh_token;
};

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
      if (err) {
        return resolve({ status: 'ERR', message: 'The authentication failed' });
      }
      const access_token = await generalAccessToken({ id: user?.id, role: user?.role });
      const refresh_token = await generalRefreshToken({ id: user?.id, role: user?.role });
      resolve({
        status: 'OK',
        message: 'Get user success',
        access_token,
        refresh_token,
      });
    });
  });
};

const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN);

    resolve({
      status: 'OK',
      message: 'Get user success',
      data,
    });
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  verifyRefreshToken,
  decodeToken,
};
