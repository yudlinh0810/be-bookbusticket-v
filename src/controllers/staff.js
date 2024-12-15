const StaffService = require('../services/staff');
const { verifyRefreshToken } = require('../services/jwt');
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-.']\w+)*@\w+([-.]\w+)*\.(com|vn|org|edu)$/i;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The input is required',
      });
    }

    if (!isCheckEmail) {
      return res.status(200).json({
        status: 'ERR',
        message: 'Email is not in correct format',
      });
    }
    const response = await StaffService.staffLogin(req.body);
    const { refresh_token, ...newData } = response;

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(newData);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: 'Controller.login err',
      error: err,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.token.split(' ')[1];
    if (!token) {
      return res.status(200).json({
        status: 'ERR',
        message: 'Token is not defined',
      });
    }
    const data = await verifyRefreshToken(token);
    const { refresh_token, ...newData } = data;

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(newData);
  } catch (error) {
    console.log('err refresh token', error);
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.refreshToken',
    });
  }
};

const fetchStaff = async (req, res) => {
  try {
    const token = req.params.token;
    const responsive = await StaffService.fetchStaff(token);
    return res.status(200).json(responsive);
  } catch (error) {
    console.log('Err at Controllers.fetchStaff');
    return res.status(400).json({
      status: 'ERR',
      message: 'ERR Controllers.fetchStaff',
    });
  }
};

module.exports = { login, refreshToken, fetchStaff };
