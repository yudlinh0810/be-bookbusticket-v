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
    { expiresIn: '60s' }
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
    { expiresIn: '60s' }
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

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  verifyRefreshToken,
};
