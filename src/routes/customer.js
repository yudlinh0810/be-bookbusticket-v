const CustomerController = require('../controllers/customer');
const express = require('express');
const uploadImageMiddleware = require('../middleware/middlewares');
const router = express.Router();
require('dotenv').config();

router.post('/login', CustomerController.login);
router.post('/register', CustomerController.register);
router.post('/verify-email', CustomerController.verifyEmail);
router.post('/refresh-token', CustomerController.refreshToken);
router.post('/get-detail-user', CustomerController.getDetailCustomer);
router.post('/update-customer', uploadImageMiddleware, CustomerController.updateCustomer);

module.exports = router;
