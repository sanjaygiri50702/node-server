const express = require('express');
const router = express.Router();
const eventCateogryController = require('../controllers/eventCateogryController');
const authController = require('./../controllers/authController');

router.get('/', eventCateogryController.getAllEventCategory);
router.get('/:id', eventCateogryController.getEventCategory);
router.get('/event/:id', eventCateogryController.getEventByCategory);
router.post('/event/:id', eventCateogryController.addEventToCategory);

router
    .route('/')
    .post(eventCateogryController.createEventCategory);

router.use(authController.protect);


// // Only admin have permission to access for the below APIs 
// router.use(authController.restrictTo('admin'));

// router
//     .route('/')
//     .post(eventCateogryController.creatEvent);

// router
//     .route('/:id')
//     .patch(eventCateogryController.updateEvent)
//     .delete(eventCateogryController.deleteEvent);

module.exports = router;