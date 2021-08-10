const mongoose = require("mongoose");
const validator = require("validator");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter the event title"],
  },
  description: {
    type: String,
    required: [false, "Please Enter the event description"],
		trim: true,
  },
  address: {
    type: String,
		trim: true,
  },
  city: {
    type: String,
		trim: true,
  },
  noOfInterest: {
    type: Number,
    default: 0
  },
  coverPhoto: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
  },
  startDateAndTime:{
    type: Date,
    default: Date.now(),
  },
  endDateAndTime:{
    type: Date,
    default: Date.now(),
  },
  host:{
    type: String,
		trim: true,
  },
  price: {
    type : String,
    default : 'Free'
  },
  currency : {
    type: String,
    default : "null"
  },
  totalSeat : {
    type: Number,
    default : 0
  },
  interestedUser: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
  category: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "EventCategory"
	}],

},
 { timestamps: true } );

eventSchema.virtual('totalInterestedUser').get(function() {
  return this.interestedUser.length;
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
