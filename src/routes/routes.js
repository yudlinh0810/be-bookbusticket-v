const routes = (app) => {
  app.use('/api/test', (req, res, next) => {
    res.json({ message: 'This is route test' });
  });
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
