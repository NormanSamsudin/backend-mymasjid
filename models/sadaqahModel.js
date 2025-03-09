const mongoose = require('mongoose');

const sadaqahSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Minimum donation amount is 1'],
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who donates
      required: [true, 'Sadaqah must have a donor'],
    },
    mosque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mosque', // Reference to the Mosque receiving the donation
      required: [true, 'Sadaqah must belong to a mosque'],
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Sadaqah = mongoose.model('Sadaqah', sadaqahSchema);

module.exports = Sadaqah;
