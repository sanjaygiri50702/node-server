const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	user: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}],
	event: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event"
		}],
	bookingDate:{
		type: Date,
		default: Date.now(),
	},
	status:{
		type: Boolean,
		default: true,
	},

}, { timestamps: true } );

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
