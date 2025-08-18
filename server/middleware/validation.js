const Joi = require('joi');

// Booking validation schema
const bookingSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  checkIn: Joi.date().iso().min('now').required(),
  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
  guests: Joi.number().integer().min(1).max(20).required(),
  accommodationType: Joi.string().valid('standard', 'deluxe').required(),
  message: Joi.string().max(500).optional(),
  specialRequests: Joi.string().max(500).optional()
});

// Contact validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required(),
  phone: Joi.string().min(10).max(15).optional(),
  subject: Joi.string().min(5).max(200).optional(),
  type: Joi.string().valid('contact', 'newsletter').default('contact')
});

// Newsletter validation schema
const newsletterSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).optional()
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ 
        message: 'Validation error',
        error: errorMessage 
      });
    }
    
    next();
  };
};

module.exports = {
  validateBooking: validate(bookingSchema),
  validateContact: validate(contactSchema),
  validateNewsletter: validate(newsletterSchema),
  validateLogin: validate(loginSchema)
};
