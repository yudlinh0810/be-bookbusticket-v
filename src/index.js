const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();

//Middleware

// Bật Cross-Origin Resource Sharing (cho phép các yêu cầu từ source khác)
app.use(cors());

// Xử lý request body với dữ liệu dạng JSON và giới hạn kích thước tối đa là 50MB
app.use(express.json({ limit: '50mb' }));

// Xử lý request body với dữ liệu dạng application/x-www-form-urlencoded, giới hạn kích thước tối đa là 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Xử lý cookie trong các yêu cầu, giúp truy cập cookie qua req.cookies
app.use(cookieParser());

//Test route
app.get('/', (req, res) => {
  res.send('Hello');
});

//Start server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
