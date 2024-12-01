require('dotenv').config();
const nodemailer = require('nodemailer');

let sendOtpEmail = async ({ email, otp }) => {
  console.log('email:', email);
  console.log('otp:', otp);

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true cho cổng 465, false cho các cổng khác
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    let info = await transporter.sendMail({
      to: email,
      subject: 'Thông tin xác thực email',
      html: getBodyHTMLEmail(otp),
    });

    console.log('Email sent:', info.messageId);
    return info; // Trả về thông tin email đã gửi
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

let getBodyHTMLEmail = (otp) => {
  let result = `
        <h3>Mã xác thực email: Có thời hạn 5 phút!</h3>
        <p>Vui lòng nhập mã sau để xác minh:</p>
        <div><b>${otp}</b></div>
        <div>Xin chân thành cảm ơn!</div>
    `;
  return result;
};

module.exports = {
  sendOtpEmail,
};
