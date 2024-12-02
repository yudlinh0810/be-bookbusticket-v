const CustomerService = require('../services/customer');
const { verifyRefreshToken } = require('../services/jwt');

const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      return res
        .status(200)
        .json({ status: 'ERR', message: 'Password and confirm password are not the same' });
    } else {
      const data = await CustomerService.register(req.body);
      const { refresh_token, ...newData } = data;

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        status: 'OK',
        newData,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: 'Controller.login err',
      error: err,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
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

    const response = await CustomerService.login(req.body);
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

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const response = await CustomerService.verifyEmail(email, otp);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      status: 'ERR',
      message: 'ERR Controller.verifyEmail',
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

module.exports = { login, register, verifyEmail, refreshToken };
