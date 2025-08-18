import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Mail, 
  Home, 
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI, contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalContacts: 0,
    unreadContacts: 0,
    recentBookings: 0,
    recentContacts: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch booking stats
      const bookingsResponse = await bookingAPI.getAll({ limit: 5 });
      const bookings = bookingsResponse.data.bookings;
      const bookingStats = bookingsResponse.data.pagination;

      // Fetch contact stats
      const contactsResponse = await contactAPI.getAll({ limit: 5 });
      const contacts = contactsResponse.data.contacts;
      const contactStats = contactsResponse.data.pagination;

      // Get contact overview stats
      const contactOverview = await contactAPI.getStats();

      // Calculate recent stats (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentBookingsCount = bookings.filter(booking => 
        new Date(booking.createdAt) >= sevenDaysAgo
      ).length;

      const recentContactsCount = contacts.filter(contact => 
        new Date(contact.createdAt) >= sevenDaysAgo
      ).length;

      setStats({
        totalBookings: bookingStats.total,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        totalContacts: contactStats.total,
        unreadContacts: contactOverview.data.unreadContacts,
        recentBookings: recentBookingsCount,
        recentContacts: recentContactsCount
      });

      setRecentBookings(bookings);
      setRecentMessages(contacts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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

  const getMessageStatusColor = (status) => {
    switch (status) {
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'unread':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <Calendar className="h-8 w-8" />,
      color: 'bg-blue-500',
      change: `+${stats.recentBookings} this week`
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: <Clock className="h-8 w-8" />,
      color: 'bg-yellow-500',
      change: 'Needs attention'
    },
    {
      title: 'Total Messages',
      value: stats.totalContacts,
      icon: <MessageSquare className="h-8 w-8" />,
      color: 'bg-green-500',
      change: `+${stats.recentContacts} this week`
    },
    {
      title: 'Unread Messages',
      value: stats.unreadContacts,
      icon: <Mail className="h-8 w-8" />,
      color: 'bg-red-500',
      change: 'Requires response'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/assets/IMG-20250817-WA0002.jpg" 
                  alt="Cozy Glory Shed" 
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-xl font-serif font-bold text-primary-700">
                    Cozy Glory Shed Admin
                  </h1>
                  <p className="text-xs text-gray-600 -mt-1">Dashboard</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your farm booking system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.change}</p>
                </div>
                <div className={`${card.color} text-white p-3 rounded-lg`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/bookings"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Bookings</h3>
                <p className="text-sm text-gray-600">View and update booking requests</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/contacts"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Messages</h3>
                <p className="text-sm text-gray-600">Handle contact form submissions</p>
              </div>
            </div>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
                <Home size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Website</h3>
                <p className="text-sm text-gray-600">See how guests view your site</p>
              </div>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <Link 
                  to="/admin/bookings"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <Eye size={14} />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {recentBookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent bookings</p>
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {booking.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {booking.email} • {booking.phone}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.guests} guest{booking.guests > 1 ? 's' : ''} • {booking.accommodationType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{booking.totalAmount?.toLocaleString() || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
                <Link 
                  to="/admin/contacts"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <Eye size={14} />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {recentMessages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent messages</p>
                </div>
              ) : (
                recentMessages.map((message) => (
                  <div key={message.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {message.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMessageStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {message.email}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
