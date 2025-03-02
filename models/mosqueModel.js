const mongoose = require('mongoose');
const validator = require('validator');

// Create mosque schema
const mosqueSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: [true, 'Mosque must have an admin']
  },
  name: {
    type: String,
    required: [true, 'Mosque must have a name'],
    unique: true,
    trim: true,
    maxlength: [100, 'The maximum length is 100 characters'],
    minlength: [5, 'The minimum length is 5 characters']
  },
  address: {
    type: String,
    required: [true, 'Mosque must have an address'],
    trim: true,
    maxlength: [200, 'The maximum length is 200 characters']
  },
  city: {
    type: String,
    required: [true, 'Mosque must have a city'],
    trim: true,
    maxlength: [50, 'The maximum length is 50 characters']
  },
  state: {
    type: String,
    required: [true, 'Mosque must have a state'],
    trim: true,
    maxlength: [50, 'The maximum length is 50 characters']
  },
  country: {
    type: String,
    required: [true, 'Mosque must have a country'],
    trim: true,
    maxlength: [50, 'The maximum length is 50 characters']
  },
  postalCode: {
    type: String,
    required: [true, 'Mosque must have a postal code'],
    trim: true,
    maxlength: [20, 'The maximum length is 20 characters']
  },
  contactEmail: {
    type: String,
    required: [true, 'Mosque must have a contact email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  contactPhone: {
    type: String,
    required: [true, 'Mosque must have a contact phone number'],
    trim: true,
    maxlength: [20, 'The maximum length is 20 characters']
  },
  website: {
    type: String,
    trim: true,
    maxlength: [100, 'The maximum length is 100 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Mosque must have a capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  location: {
    type: {
      type: String, // GeoJSON type
      default: 'Point',
      enum: ['Point'] // Only 'Point' is allowed
    },
    coordinates: {
      type: [Number], // Array of numbers: [longitude, latitude]
      required: [true, 'Mosque must have coordinates']
    }
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '' // Default to an empty string if no image is provided
  },
  qrUrl: {
    type: String,
    trim: true,
    default: '' // Default to an empty string if no QR code is provided
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the 'updatedAt' field before saving
mosqueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a 2dsphere index for geospatial queries
mosqueSchema.index({ location: '2dsphere' });

// Create model of the mosque schema
const Mosque = mongoose.model('Mosque', mosqueSchema);

module.exports = Mosque;