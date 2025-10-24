const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
    trim: true
  },
  packageType: {
    type: String,
    required: true,
    enum: ['Budget', 'Standard', 'Luxury']
  },
  price: {
    type: Number,
    required: true
  },
  bookerDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  travelDetails: {
    numberOfTravelers: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    travelDate: {
      type: Date,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['UPI', 'Card', 'NetBanking', 'Pending'], // ADD 'Pending' here
      default: 'Pending' // Add default value
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);