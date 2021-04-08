const Event = require('../models/eventModel');
const base = require('./baseController');
const ContentBasedRecommender = require('../utils/ContentBasedRecommender')
const recommender = new ContentBasedRecommender({
	minScore: 0,
	maxSimilarDocuments: 100
});

exports.creatEvent = async (req, res, next) => {
    try {
		const event = await Event.create({
			title: req.body.title,
			description: req.body.description,
			address: req.body.address,
			city: req.body.city,
			noOfInterest: req.body.noOfInterest,
			coverPhoto: req.body.coverPhoto,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			startTime: req.body.startTime,
			endTime: req.body.endTime,
			host: req.body.host,
			price: req.body.price,
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

exports.bookEvent = async(req, res, next) =>{
  
}

exports.getAllEvents = base.getAll(Event);
exports.getEvent = base.getOne(Event);

// Don't update password on this 
exports.updateEvent = base.updateOne(Event);
exports.deleteEvent = base.deleteOne(Event);

