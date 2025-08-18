import React, { useState } from 'react';
import { X, Calendar, Users, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BookingForm = ({ selectedRoom, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    accommodationType: selectedRoom?.id || 'standard',
    message: '',
    specialRequests: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset availability check when dates change
    if (name === 'checkIn' || name === 'checkOut' || name === 'accommodationType') {
      setAvailabilityChecked(false);
      setIsAvailable(false);
      setTotalAmount(0);
    }
  };

  const calculateAmount = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const rates = {
      standard: 2500,
      deluxe: 3500
    };
    
    return nights * rates[formData.accommodationType];
  };

  const checkAvailability = async () => {
    if (!formData.checkIn || !formData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    setCheckingAvailability(true);
    try {
      const response = await bookingAPI.checkAvailability({
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        accommodationType: formData.accommodationType
      });

      setIsAvailable(response.data.available);
      setAvailabilityChecked(true);
      
      if (response.data.available) {
        const amount = calculateAmount();
        setTotalAmount(amount);
        toast.success('Accommodation is available!');
      } else {
        toast.error('Accommodation is not available for selected dates');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!availabilityChecked || !isAvailable) {
      toast.error('Please check availability first');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        guests: parseInt(formData.guests)
      };

      await bookingAPI.create(bookingData);
      toast.success('Booking request submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      const message = error.response?.data?.message || 'Failed to submit booking';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getRoomDetails = () => {
    const rooms = {
      standard: { name: 'Standard Room', price: 2500, capacity: 2 },
      deluxe: { name: 'Deluxe Room', price: 3500, capacity: 4 }
    };
    return rooms[formData.accommodationType];
  };

  const roomDetails = getRoomDetails();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Book Your Stay
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accommodation Type
            </label>
            <select
              name="accommodationType"
              value={formData.accommodationType}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="standard">Standard Room - ₹2,500/night</option>
              <option value="deluxe">Deluxe Room - ₹3,500/night</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Check-in Date
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Check-out Date
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Number of Guests
            </label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              {Array.from({ length: roomDetails.capacity }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Guest{i + 1 > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Check */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Check Availability</h3>
              <button
                type="button"
                onClick={checkAvailability}
                disabled={checkingAvailability || !formData.checkIn || !formData.checkOut}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkingAvailability ? 'Checking...' : 'Check Availability'}
              </button>
            </div>
            
            {availabilityChecked && (
              <div className={`p-3 rounded-md ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isAvailable ? (
                  <div>
                    <p className="font-medium">✓ Available!</p>
                    <p className="text-sm mt-1">
                      {roomDetails.name} for {Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))} night(s)
                    </p>
                    <p className="text-lg font-bold mt-2">
                      Total: ₹{totalAmount.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="font-medium">✗ Not available for selected dates</p>
                )}
              </div>
            )}
          </div>

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Guest Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="input-field"
                placeholder="Any special requests or questions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={2}
                className="input-field"
                placeholder="Dietary requirements, accessibility needs, etc."
              />
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <p className="mb-2">
              <strong>Booking Terms:</strong>
            </p>
            <ul className="space-y-1 text-xs">
              <li>• This is a booking request and subject to availability confirmation</li>
              <li>• Check-in: 2:00 PM | Check-out: 11:00 AM</li>
              <li>• Free cancellation up to 48 hours before check-in</li>
              <li>• Payment can be made at the property or online</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !availabilityChecked || !isAvailable}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
