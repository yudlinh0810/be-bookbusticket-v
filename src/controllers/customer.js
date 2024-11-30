const CustomerService = require('../services/customer');

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

    const data = await CustomerService.login(req.body);
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
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: 'Controller.login err',
      error: err,
    });
  }
};

module.exports = { login };
