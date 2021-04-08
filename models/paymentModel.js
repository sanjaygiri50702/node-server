const mongoose = require("mongoose");
const validator = require("validator");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Please Enter the event title"],
  },

  description: {
    type: String,
    required: [false, "Please Enter the event description"],
  },
}, { timestamps: true } );

// encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
// paymentSchema.pre("save", async function(next) {
//   // check the password if it is modified
//   if (!this.isModified("password")) {
//     return next();
//   }

//   // Hashing the password
//   this.password = await bcrypt.hash(this.password, 12);

//   // Delete passwordConfirm field
//   this.passwordConfirm = undefined;
//   next();
// });

// This is Instance Method that is gonna be available on all documents in a certain collection
// paymentSchema.methods.correctPassword = async function(
//   typedPassword,
//   originalPassword,
// ) {
//   return await bcrypt.compare(typedPassword, originalPassword);
// };

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
