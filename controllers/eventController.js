const Event = require('../models/eventModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const base = require('./baseController');
require('dotenv').config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const ContentBasedRecommender = require('../utils/ContentBasedRecommender')
const recommender = new ContentBasedRecommender({
	minScore: 0,
	maxSimilarDocuments: 100
});

const createTransporter = async () => {
	const oauth2Client = new OAuth2(
	  process.env.CLIENT_ID,
	  process.env.CLIENT_SECRET,
	  "https://developers.google.com/oauthplayground"
	);
  
	oauth2Client.setCredentials({
	  refresh_token: process.env.REFRESH_TOKEN
	});
  
	const accessToken = await new Promise((resolve, reject) => {
	  oauth2Client.getAccessToken((err, token) => {
		if (err) {
		  reject("Failed to create access token :(");
		}
		resolve(token);
	  });
	});
  
	const transporter = nodemailer.createTransport({
	  service: "gmail",
	  auth: {
		type: "OAuth2",
		user: process.env.EMAIL,
		accessToken,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN
	  }
	});
  
	return transporter;
  };

const sendEmail = async (emailOptions) => {
	let emailTransporter = await createTransporter();
	await emailTransporter.sendMail(emailOptions);
};

exports.creatEvent = async (req, res, next) => {
	console.log(req.file);

    try {
		const event = await Event.create({
			title: req.body.title,
			description: req.body.description,
			address: req.body.address,
			city: req.body.city,
			noOfInterest: req.body.noOfInterest,
			startDateAndTime: req.body.startDateAndTime,
			endDateAndTime: req.body.endDateAndTime,
			host: req.body.host,
			price: req.body.price,
			isFeatured: req.body.isFeatured,
		});
  
		res.status(200).json({
			status: "success",
			data: {
				event,
			},
		});
    } catch (err) {
		next(err);
    }
};

exports.uploadCoverphoto = async (req, res, next) => {
	console.log(req.filename);
	try{
		const doc = await Event.findByIdAndUpdate(req.params.eventId, {coverPhoto : req.file.filename }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });

	} catch(err){
		next(err);
	}
};

exports.getRecommendEvent = async(req, res, next) =>{
	try{
		const document = await Event.find({}, ['_id', 'title']);
		const documents = [];
		document.forEach( doc=> documents.push({
			'id': doc._id,
			'content': doc.title
		}) )
		recommender.train(documents);
		const similarDocuments = recommender.getSimilarDocuments(req.params.eventId, 0, 10);
		const similarPopulateDocument = await Event.find({'_id':{ 
			$in : similarDocuments.map(sd => sd.id)
		}});

		res.status(201).json({
			status: "success",
			data: {
				similarPopulateDocument,
				similarDocuments
			},
		});
	} catch(err){
		next(err);
	}
}

exports.cancelEvent = async(req, res, next) =>{
	try{
		const doc = await Booking.findByIdAndUpdate(req.params.bookingId, {status : 'false' }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });

	} catch(err){
		next(err);
	}
}

exports.bookEvent = async(req, res, next) =>{
	// console.log(process.env.EMAIL)
    try {
		console.log(req.body);
	
		const event = await Booking.create({
			user: req.body.userId,
			event: req.body.eventId,
			bookingDate: req.body.bookingDate,
		});
		await event.populate('user').populate('event').execPopulate();
		// console.log(`This is Confirmation Booking event ${event.event[0].title} Booked By ${event.user[0].username}`)
		console.log(event);

		sendEmail({
			subject: "Booking Event",
			html: `<h1>This is Confirmation Booking event</h1><hr>
					<p>Event Name ::=== ${event.event[0].title}</p>
					<p>Booked By ::=== ${event.user[0].username}</p>
					<p>Booking ID ::==== ${event._id}</p>
					<p>Booking Date ::=== ${event.bookingDate}</p>
					<p>Price  ::=== NRP ${event.event[0].price}</p>`,
			to: "sanjay.themepalace@gmail.com",
			from: process.env.EMAIL
		});
  
		res.status(200).json({
			status: "success",
			data:{
				event
			}
		});
		
    } catch (err) {
		next(err);
    }
}

exports.getAllBooking = async(req, res, next) =>{
	// console.log(process.env.EMAIL)
	try {
        const booking = await Booking.find().populate('user').populate('event').exec();
		if (!booking) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: booking
            }
        });

    } catch (err) {
        next(err);
    }
}

exports.getUserBooking = async(req, res, next) =>{
	// console.log(process.env.EMAIL)
	try {
        const booking = await Booking.find({user: req.params.userId}).populate('user').populate('event').exec();
		console.log(booking)
		if (!booking) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: booking
            }
        });

    } catch (err) {
        next(err);
    }
}

exports.getBooking = async(req, res, next) =>{
	// console.log(process.env.EMAIL)
	try {
        const booking = await Booking.find({ _id: req.params.bookingId}).populate('user').populate('event').exec();
		console.log(booking)
		if (!booking) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: booking
            }
        });

    } catch (err) {
        next(err);
    }
}

exports.getAllEvents = base.getAll(Event);
// exports.getAllBooking = base.getAll(Booking);
exports.getEvent = base.getOne(Event);

// Don't update password on this 
exports.updateEvent = base.updateOne(Event);
exports.deleteEvent = base.deleteOne(Event);

