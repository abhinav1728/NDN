const express = require('express');
const { Op } = require('sequelize');
const { Contact } = require('../models');
const { validateContact, validateNewsletter } = require('../middleware/validation');
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

// Send contact notification email
const sendContactNotification = async (contact) => {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New ${contact.type === 'newsletter' ? 'Newsletter Subscription' : 'Contact Form'} - Srishti The Farm`,
      html: `
        <h2>New ${contact.type === 'newsletter' ? 'Newsletter Subscription' : 'Contact Form Submission'}</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
        ${contact.subject ? `<p><strong>Subject:</strong> ${contact.subject}</p>` : ''}
        <p><strong>Message:</strong> ${contact.message}</p>
        <p><strong>Type:</strong> ${contact.type}</p>
        <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent');
  } catch (error) {
    console.error('Error sending contact notification:', error);
  }
};

// Submit contact form
router.post('/', validateContact, async (req, res) => {
  try {
    const contactData = req.body;
    const contact = await Contact.create(contactData);

    // Send notification email
    await sendContactNotification(contact);

    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        type: contact.type,
        status: contact.status
      }
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
});

// Newsletter subscription
router.post('/newsletter', validateNewsletter, async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Check if email already exists
    const existingSubscription = await Contact.findOne({
      where: { email, type: 'newsletter' }
    });

    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed to newsletter' });
    }

    const contact = await Contact.create({
      name: name || 'Newsletter Subscriber',
      email,
      message: 'Newsletter subscription',
      type: 'newsletter'
    });

    // Send notification email
    await sendContactNotification(contact);

    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
      subscription: {
        id: contact.id,
        email: contact.email,
        type: contact.type
      }
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe to newsletter' });
  }
});

// Get all contacts (admin only)
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
    
    // Filter by type
    if (req.query.type && req.query.type !== 'all') {
      whereClause.type = req.query.type;
    }
    
    // Search functionality
    if (req.query.search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { email: { [Op.iLike]: `%${req.query.search}%` } },
        { message: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      contacts,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// Get contact by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Failed to fetch contact' });
  }
});

// Update contact status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.status = status;
    await contact.save();

    res.json({
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Failed to update contact status' });
  }
});

// Delete contact (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.destroy();

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

// Get contact statistics (admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalContacts = await Contact.count();
    const unreadContacts = await Contact.count({ where: { status: 'unread' } });
    const newsletterSubscriptions = await Contact.count({ where: { type: 'newsletter' } });
    const contactForms = await Contact.count({ where: { type: 'contact' } });

    // Recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentContacts = await Contact.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    res.json({
      totalContacts,
      unreadContacts,
      newsletterSubscriptions,
      contactForms,
      recentContacts
    });
  } catch (error) {
    console.error('Error fetching contact statistics:', error);
    res.status(500).json({ message: 'Failed to fetch contact statistics' });
  }
});

module.exports = router;
