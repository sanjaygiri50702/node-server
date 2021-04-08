const mongoose = require("mongoose");
const validator = require("validator");

const eventCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter the category title"],
  },
  description: {
    type: String,
    required: [false, "Please Enter the category description"],
    trim: true,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  ]

}, { timestamps: true } );


const EventCategory = mongoose.model("EventCategory", eventCategorySchema);
module.exports = EventCategory;
