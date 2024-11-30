const CustomerController = require('../controllers/customer');
const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/login', CustomerController.login);

module.exports = router;
