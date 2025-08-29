import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Home, 
  LogOut,
  Filter,
  Search,
  Check,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const { logout } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchContacts();
  }, [pagination.page, statusFilter, typeFilter, fetchContacts]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter })
      };

      const response = await contactAPI.getAll(params);
      setContacts(response.data.contacts);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      await contactAPI.updateStatus(contactId, newStatus);
      toast.success(`Contact marked as ${newStatus}`);
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'newsletter':
        return 'bg-purple-100 text-purple-800';
      case 'contact':
        return 'bg-orange-100 text-orange-800';
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
          <h1 className="text-3xl font-serif font-bold text-gray-900">Contact Management</h1>
          <p className="text-gray-600 mt-2">Manage contact form submissions and newsletter subscriptions</p>
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
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="contact">Contact Form</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contacts List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading contacts...</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No contacts found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`p-6 hover:bg-gray-50 cursor-pointer ${
                        selectedContact?.id === contact.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {contact.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(contact.type)}`}>
                              {contact.type}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {contact.email}
                          </p>
                          
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {contact.message}
                          </p>
                          
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(contact.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          {contact.status === 'unread' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateContactStatus(contact.id, 'read');
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark as Read"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          
                          {contact.status !== 'replied' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateContactStatus(contact.id, 'replied');
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Replied"
                            >
                              <Check size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              {selectedContact ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedContact.type)}`}>
                        {selectedContact.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedContact.status)}`}>
                        {selectedContact.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-sm text-gray-900">{selectedContact.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900">{selectedContact.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedContact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {selectedContact.status === 'unread' && (
                      <button
                        onClick={() => updateContactStatus(selectedContact.id, 'read')}
                        className="w-full btn-primary flex items-center justify-center"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Mark as Read
                      </button>
                    )}
                    
                    {selectedContact.status !== 'replied' && (
                      <button
                        onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Replied
                      </button>
                    )}

                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: Your inquiry to Cozy Glory Shed`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Reply via Email
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a contact to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContacts;
