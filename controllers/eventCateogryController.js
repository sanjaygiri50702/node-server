const EventCategory = require('../models/eventCategoryModel');
const Event  = require('../models/eventModel');
const base = require('./baseController');

exports.getAllEventCategory = base.getAll(EventCategory);
exports.getEventCategory = base.getOne(EventCategory);

// Don't update password on this 
exports.updateEvent = base.updateOne(EventCategory);
exports.deleteEvent = base.deleteOne(EventCategory);

exports.getEventByCategory = async(req, res, next) =>{
    try {
        const doc = await EventCategory.findById(req.params.id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    } catch (error) {
        next(error);
    }
}


exports.createEventCategory = async (req, res, next) => {
    try {
		const doc = await EventCategory.create({
			title: req.body.title,
			description: req.body.description,
		});
		res.status(200).json({
			status: "success",
			data: {
				doc,
			},
		});
    } catch (err) {
		next(err);
    }
};
exports.getEventByCategory = async(req, res, next) =>{
    try {
        const doc = await EventCategory.findById(req.params.id).populate('events');

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    } catch (error) {
        next(error);
    }
}
exports.addEventToCategory = async(req, res, next) =>{
    try {
        const doc = await EventCategory.findByIdAndUpdate(req.params.id).populate('events');

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    } catch (error) {
        next(error);
    }
}
