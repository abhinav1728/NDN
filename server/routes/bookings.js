const express = require('express');
const { Op } = require('sequelize');
const { Booking } = require('../models');
const { validateBooking } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email transporter setup
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send booking notification email
const sendBookingNotification = async (booking) => {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Booking Request - Srishti The Farm',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Guest:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Check-in:</strong> ${booking.checkIn}</p>
        <p><strong>Check-out:</strong> ${booking.checkOut}</p>
        <p><strong>Guests:</strong> ${booking.guests}</p>
        <p><strong>Accommodation:</strong> ${booking.accommodationType}</p>
        <p><strong>Message:</strong> ${booking.message || 'No message'}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        <p><strong>Submitted:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking notification email sent');
  } catch (error) {
    console.error('Error sending booking notification:', error);
  }
};

// Create new booking
router.post('/', validateBooking, async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Calculate total amount based on accommodation type and duration
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const rates = {
      standard: 2500,
      deluxe: 3500
    };
    
    bookingData.totalAmount = nights * rates[bookingData.accommodationType];

    const booking = await Booking.create(bookingData);

    // Send notification email
    await sendBookingNotification(booking);

    res.status(201).json({
      message: 'Booking request submitted successfully',
      booking: {
        id: booking.id,
        name: booking.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        accommodationType: booking.accommodationType,
        totalAmount: booking.totalAmount,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// Get all bookings (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      whereClause.status = req.query.status;
    }
    
    // Filter by accommodation type
    if (req.query.accommodationType && req.query.accommodationType !== 'all') {
      whereClause.accommodationType = req.query.accommodationType;
    }
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      whereClause.checkIn = {
        [Op.between]: [req.query.startDate, req.query.endDate]
      };
    }

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      bookings,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Get booking by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

// Check availability
router.post('/check-availability', async (req, res) => {
  try {
    const { checkIn, checkOut, accommodationType } = req.body;

    if (!checkIn || !checkOut || !accommodationType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for overlapping bookings
    const conflictingBookings = await Booking.count({
      where: {
        accommodationType,
        status: {
          [Op.in]: ['pending', 'confirmed']
        },
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            checkOut: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            [Op.and]: [
              { checkIn: { [Op.lte]: checkIn } },
              { checkOut: { [Op.gte]: checkOut } }
            ]
          }
        ]
      }
    });

    const isAvailable = conflictingBookings === 0;

    res.json({
      available: isAvailable,
      message: isAvailable ? 'Accommodation is available' : 'Accommodation is not available for selected dates'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Failed to check availability' });
  }
});

module.exports = router;
