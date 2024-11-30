const CustomerRouter = require('./customer');

const routes = (app) => {
  app.use('/api/customer', CustomerRouter);
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
