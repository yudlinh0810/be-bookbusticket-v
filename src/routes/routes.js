const CustomerRouter = require('./customer');
const TripRouter = require('./trip');
const DepartureRouter = require('./departure');
const DestinationRouter = require('./destination');
const StaffRouter = require('./staff');

const routes = (app) => {
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', req.headers.origin);
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  //   );
  //   if (req.method === 'OPTIONS') {
  //     res.sendStatus(200);
  //   } else {
  //     next();
  //   }
  // });
  app.use('/api/staff', StaffRouter);
  app.use('/api/customer', CustomerRouter);
  app.use('/api/departure', DepartureRouter);
  app.use('/api/destination', DestinationRouter);
  app.use('/api/trip', TripRouter);
  app.use((req, res) => {
    res.status(404).json({
      status: 'ERROR',
      message: '404 NOT FOUND!',
    });
  });
  app.use((err, req, res, next) => {
    console.log('Err route', err.stack);
    res.status(500).json({
      status: 'Err',
      message: 'Internal Server Error!',
    });
  });
};

module.exports = routes;
