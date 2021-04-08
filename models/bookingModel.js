const mongoose = require("mongoose");
const validator = require("validator");

const bookingSchema = new mongoose.Schema({
  user: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
  event: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "EventCategory"
	}],

}, { timestamps: true } );



const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
