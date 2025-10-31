const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendBookingConfirmation, sendTripConfirmation } = require('../utils/mailer');

// Create new booking
router.post('/', async (req, res) => {
  try {
    console.log('📦 Received booking data:', req.body);
    
    const booking = new Booking({
      packageName: req.body.packageName,
      packageType: req.body.packageType,
      price: req.body.price,
      bookerDetails: {
        name: req.body.bookerDetails.name,
        email: req.body.bookerDetails.email,
        phone: req.body.bookerDetails.phone
      },
      travelDetails: {  
        numberOfTravelers: req.body.travelDetails.numberOfTravelers,
        travelDate: req.body.travelDetails.travelDate
      },
      payment: {
        method: req.body.payment?.method || 'Pending'
      },
      totalAmount: req.body.totalAmount
    });

    const savedBooking = await booking.save();
    console.log('✅ Booking saved to database:', savedBooking._id);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });
  } catch (error) {
    console.error('❌ Error saving booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    console.log(`📊 Found ${bookings.length} bookings in database`);
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Send confirmation email when booking is confirmed by admin
    if (status === 'Confirmed' && booking?.bookerDetails?.email) {
      try {
        console.log(`📧 Sending trip confirmation email to: ${booking.bookerDetails.email}`);
        
        await sendTripConfirmation({
          to: booking.bookerDetails.email,
          name: booking.bookerDetails.name,
          booking: {
            ...booking.toObject(),
            travelDetails: booking.travelDetails || {}
          }
        });
        
        console.log(`✅ Trip confirmation email sent successfully to ${booking.bookerDetails.email}`);
        
        // Update booking with email sent status
        booking.emailSent = true;
        booking.emailSentAt = new Date();
        booking.emailError = undefined;
        await booking.save();
        
      } catch (emailError) {
        console.error('❌ Error sending trip confirmation email:', emailError);
        
        // Update booking with email error
        booking.emailError = emailError.message;
        await booking.save();
        
        // Don't fail the entire request if email fails
        console.log('⚠️  Continuing with status update despite email error');
      }
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking,
      emailSent: booking.emailSent || false,
      emailError: booking.emailError || null
    });
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete individual booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    console.log(`🗑️ Deleted booking: ${req.params.id}`);
    
    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
});

// Clear all bookings (for admin use)
router.delete('/clear-all', async (req, res) => {
  try {
    const result = await Booking.deleteMany({});
    console.log(`🗑️ Cleared all bookings: ${result.deletedCount} records`);
    
    res.json({
      success: true,
      message: `All bookings cleared (${result.deletedCount} records)`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('❌ Error clearing bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing bookings',
      error: error.message
    });
  }
});

module.exports = router;