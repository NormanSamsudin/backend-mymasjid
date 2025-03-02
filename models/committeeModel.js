const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema(
  {
    mosque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mosque', // Reference to the Mosque model
      required: true,
    },
    position: {
      type: String,
      required: [true, 'A committee member must have a position'],
      enum: ['Pengerusi', 'Timb. Pengerusi', 'Setiausaha', 'Bendahari'], 
    },
    name: {
      type: String,
      required: [true, 'A committee member must have a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'A committee member must have an email'],
      lowercase: true,
      validate: {
        validator: function (val) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
        },
        message: 'Please provide a valid email',
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '' // Default to an empty string if no image is provided
    },
  },
  { timestamps: true }
);

const Committee = mongoose.model('Committee', committeeSchema);

module.exports = Committee;
