const StaffController = require('../controllers/staff');
const express = require('express');
const uploadImageMiddleware = require('../middleware/middlewares');
const router = express.Router();
require('dotenv').config();

router.post('/login', StaffController.login);
router.post('/refresh-token', StaffController.refreshToken);
router.post('/get-detail-staff/:token', StaffController.fetchStaff);
// router.post('/update-staff', uploadImageMiddleware, CustomerController.updateCustomer);
// router.delete('/delete-staff/:id', CustomerController.deleteCustomer);
// router.get('/get-all-staff', CustomerController.getAllCustomer);
// router.post('/create-staff', CustomerController.createCustomer);

module.exports = router;
