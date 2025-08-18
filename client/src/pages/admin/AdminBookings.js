import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Home, 
  LogOut,
  Filter,
  Search,
  Eye,
  Check,
  X,
  Clock,
  Users,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [accommodationFilter, setAccommodationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, statusFilter, accommodationFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(accommodationFilter !== 'all' && { accommodationType: accommodationFilter })
      };

      const response = await bookingAPI.getAll(params);
      setBookings(response.data.bookings);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccommodationColor = (type) => {
    switch (type) {
      case 'deluxe':
        return 'bg-purple-100 text-purple-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center space-x-2">
                <img 
                  src="/assets/IMG-20250817-WA0002.jpg" 
                  alt="Cozy Glory Shed" 
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-xl font-serif font-bold text-primary-700">
                    Cozy Glory Shed Admin
                  </h1>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-600 hover:text-primary-600 text-sm">
                Dashboard
              </Link>
              <Link to="/" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
                <Home size={16} />
                <span className="text-sm">View Site</span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 flex items-center space-x-1"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-2">Manage guest booking requests and reservations</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={accommodationFilter}
                  onChange={(e) => setAccommodationFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Rooms</option>
                  <option value="standard">Standard Room</option>
                  <option value="deluxe">Deluxe Room</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading bookings...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className={`p-6 hover:bg-gray-50 cursor-pointer ${
                        selectedBooking?.id === booking.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {booking.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccommodationColor(booking.accommodationType)}`}>
                              {booking.accommodationType}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Mail size={14} />
                              <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone size={14} />
                              <span>{booking.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users size={14} />
                              <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-400">
                            Submitted: {new Date(booking.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ₹{booking.totalAmount?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateBookingStatus(booking.id, 'confirmed');
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                  title="Confirm Booking"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateBookingStatus(booking.id, 'cancelled');
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                  title="Cancel Booking"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateBookingStatus(booking.id, 'completed');
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark as Completed"
                              >
                                <Clock size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                        disabled={pagination.page === pagination.pages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                          </span>{' '}
                          of <span className="font-medium">{pagination.total}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={pagination.page === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  pagination.page === pageNum
                                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                            disabled={pagination.page === pagination.pages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              {selectedBooking ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccommodationColor(selectedBooking.accommodationType)}`}>
                        {selectedBooking.accommodationType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                      <p className="text-sm text-gray-900">{selectedBooking.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                      <p className="text-sm text-gray-900">{selectedBooking.email}</p>
                      <p className="text-sm text-gray-900">{selectedBooking.phone}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                        <p className="text-sm text-gray-900">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                        <p className="text-sm text-gray-900">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                        <p className="text-sm text-gray-900">{selectedBooking.guests}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                        <p className="text-sm text-gray-900 font-semibold">₹{selectedBooking.totalAmount?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </div>

                    {selectedBooking.message && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {selectedBooking.message}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedBooking.specialRequests && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {selectedBooking.specialRequests}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedBooking.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {selectedBooking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Confirm Booking
                        </button>
                        <button
                          onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </button>
                      </>
                    )}
                    
                    {selectedBooking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </button>
                    )}

                    <a
                      href={`mailto:${selectedBooking.email}?subject=Booking Update - Cozy Glory Shed`}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a booking to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminBookings;
