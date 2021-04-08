const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authController = require('./../controllers/authController');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

router.get('/recommend/:eventId', eventController.getRecommendEvent);
router.use(authController.protect);
router.get('/booking', eventController.bookEvent);


// // Only admin have permission to access for the below APIs 
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .post(eventController.creatEvent);

router
    .route('/:id')
    .patch(eventController.updateEvent)
    .delete(eventController.deleteEvent);

module.exports = router;