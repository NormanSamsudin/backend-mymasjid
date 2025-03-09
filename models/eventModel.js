const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'An event must have a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'An event must have a date'],
    },
    time: {
      type: String,
      required: [true, 'An event must have a time'],
    },
    location: {
      type: String,
      required: [true, 'An event must have a location'],
    },
    mosque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mosque', // Reference to Mosque
      required: [true, 'An event must belong to a mosque'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User organizing the event
      required: [true, 'An event must have an organizer'],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    imageUrl: {
      type: String,
      default: 'default.jpg', // Default event image
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
