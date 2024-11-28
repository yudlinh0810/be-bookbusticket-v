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

const routes = require('./routes/routes');
routes(app);

const connection = require('./database/connect');

app.get('/deploy_check', (req, res) => {
  const query = `
    select trip.name, departure.location, destination.location, car.license_plate, seat.position
    from trip
    inner join departure
    on trip.departure_id = departure.id
    inner join destination
    on trip.destination_id = destination.id
    inner join car
    on trip.car_id = car.id
    inner join seat
    on seat.car_id = car.id
  `;
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ error: 'Database query failed' });
    }
    console.log(result);
    res.send(result);
  });
});
