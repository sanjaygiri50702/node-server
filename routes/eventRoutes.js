const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authController = require('./../controllers/authController');

router.get('/', eventController.getAllEvents);

router.get('/recommend/:eventId', eventController.getRecommendEvent);
router.get('/booking', eventController.getAllBooking);
router.get('/booking/:bookingId', eventController.getBooking);
router.get('/booking/user/:userId', eventController.getUserBooking);
router.post('/booking', eventController.bookEvent);
router.get('/booking/cancel/:bookingId', eventController.cancelEvent);
router.get('/:id', eventController.getEvent);
router.use(authController.protect);


// // Only admin have permission to access for the below APIs 
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .post(eventController.creatEvent);
router
    .route('/:eventId')
    .post(eventController.uploadCoverphoto);

router
    .route('/:id')
    .patch(eventController.updateEvent)
    .delete(eventController.deleteEvent);

module.exports = router;