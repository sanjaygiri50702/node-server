const express = require('express');
const router = express.Router();
const paymentController = require('./../controllers/paymentController');
const authController = require('./../controllers/authController');

router.use(authController.protect);

router.get("/public-key", paymentController.publishableKey);

router.post("/", paymentController.initializePayment);
module.exports = router;