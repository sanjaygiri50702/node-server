const User = require('../models/userModel');
const Event = require('../models/eventModel');
const base = require('./baseController');
const AppError = require("../utils/appError");

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            active: false
        });

        res.status(204).json({
            status: 'success',
            data: null
        });


    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = base.getAll(User);
exports.getUser = base.getOne(User);

// Don't update password on this 
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);

exports.interestEvent = async(req, res, next) =>{
    try {
        const doc = await Event.findById(req.params.eventId);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }
        const userById = await User.findByIdAndUpdate(req.user.id,
            {
                $push: {
                    interestedEvent: doc._id,
                }
            },
            { new: true, useFindAndModify: false } 
        );
        const eventById = await Event.findByIdAndUpdate(doc._id,
            {
                $push: {
                    interestedUser: req.user.id,
                }
            },
            { new: true, useFindAndModify: false } 
        );
        res.status(200).json({
            status: 'success',
            data: eventById
        });
    } catch (error) {
        next(error);
    }
}