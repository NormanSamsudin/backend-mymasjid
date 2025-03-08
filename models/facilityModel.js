const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    mosque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mosque', // Reference to the Mosque model
      required: true,
    },
    name: {
      type: String,
      required: [true, 'A facility must have a name'],
      trim: true,
    },
    fee: {
      type: Number,
      required: [true, 'A facility must have a fee'],
      min: [0, 'Fee cannot be negative'], // Ensure fee is non-negative
    },
    details: {
      type: [String], // Array of details
      trim: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Facility = mongoose.model('Facility', facilitySchema);

module.exports = Facility;
