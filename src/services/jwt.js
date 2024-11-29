const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const generalAccessToken = (payload) => {
  const { id, role } = payload;
  const access_token = jwt.sign(
    {
      id,
      role,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: '10s' }
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
    { expiresIn: '30s' }
  );
};

const checkRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
      if (err) {
        resolve({
          status: 'ERR',
          message: 'The authentication',
        });
      }

      const access_token = generalAccessToken({ id: user?.id, role: user?.role });

      resolve({
        status: 'OK',
        message: 'Get user success',
        access_token,
      });
    });
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  checkRefreshToken,
};
