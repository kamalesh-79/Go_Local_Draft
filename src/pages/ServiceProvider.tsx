import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Phone, Mail, Clock, CheckCircle, Award, Calendar, MessageCircle, Heart, Share2, ArrowLeft, Camera, Users, ThumbsUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";

const ServiceProvider: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("about");
  const [showContactForm, setShowContactForm] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    description: '',
    serviceType: ''
  });
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      
      try {
        const response = await apiService.searchProvider(id);
        if (response.success) {
          setProvider(response.data);
        }
      } catch (error) {
        console.error('Error fetching provider:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to book a service');
      return;
    }

    try {
      const response = await apiService.bookRequest({
        providerId: id,
        serviceType: bookingData.serviceType || provider?.serviceType,
        description: bookingData.description
      });

      if (response.success) {
        alert('Booking request sent successfully!');
        setShowContactForm(false);
        setBookingData({ description: '', serviceType: '' });
      } else {
        alert('Failed to send booking request. Please try again.');
      }
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to send booking request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider not found</h2>
          <Link to="/services" className="text-blue-600 hover:text-blue-700">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/services"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Services
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Provider Header */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <span className="text-6xl">👤</span>
                  </div>
                  {provider.verified && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {provider.name}
                    </h1>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      @{provider.username}
                    </span>
                  </div>

                  <p className="text-xl text-blue-600 font-medium mb-2">
                    {provider.serviceType}
                  </p>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium text-gray-900">
                        {provider.rating || 4.5}
                      </span>
                      <span className="ml-1 text-gray-500">(0 reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Experience: {provider.experience || '2+'} years
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      0 jobs completed
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8">
                  {[
                    { id: "about", label: "About" },
                    { id: "reviews", label: "Reviews" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === "about"  && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About Myself
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {provider.description || 'Professional service provider with years of experience.'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Service Details
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Service Type</span>
                            <p className="font-medium">{provider.serviceType}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Hourly Rate</span>
                            <p className="font-medium">₹{provider.hourlyRate || 500}/hour</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Location</span>
                            <p className="font-medium">{provider.location}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Availability</span>
                            <p className="font-medium text-green-600">Available</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-medium">
                          {provider.rating || 4.5} out of 5
                        </span>
                        <span className="text-gray-500">(0 reviews)</span>
                      </div>
                    </div>

                    <div className="text-center py-12">
                      <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                      <p className="text-gray-500">Be the first to review this provider</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{provider.hourlyRate || 500}/hour
                </div>
                <p className="text-gray-600">Starting price</p>
              </div>

              <div className="space-y-4 mb-6">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Service
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Send Message
                </button>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{provider.phone || 'Available after booking'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{provider.email || 'Available after booking'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{provider.location}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium">Within 1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-time Delivery</span>
                    <span className="font-medium">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Book Service with {provider.name}</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleBookService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <input
                  type="text"
                  value={bookingData.serviceType}
                  onChange={(e) => setBookingData({...bookingData, serviceType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={provider.serviceType}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={bookingData.description}
                  onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your requirements..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Send Booking Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProvider;