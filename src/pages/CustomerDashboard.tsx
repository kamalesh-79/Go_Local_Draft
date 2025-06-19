import React, { useState, useEffect } from "react";
import { Calendar, Heart, Star, TrendingUp, CreditCard, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsResponse = await apiService.getBookedRequests();
        if (bookingsResponse.success) {
          setBookings(bookingsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      icon: Calendar,
      label: "Total Bookings",
      value: bookings.length.toString(),
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Heart,
      label: "Favorite Providers",
      value: "0",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      icon: CreditCard,
      label: "Total Spent",
      value: "₹0",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Star,
      label: "Average Rating Given",
      value: "0",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your bookings and discover new services
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "bookings", label: "My Bookings", icon: Calendar },
                { id: "favorites", label: "Favorites", icon: Heart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Recent Bookings
                  </h3>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No bookings yet</p>
                      <p className="text-sm text-gray-400">Start by browsing our services</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking: any) => (
                        <div key={booking.id} className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {booking.serviceType || 'Service'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {booking.providerName || 'Provider'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  All Bookings
                </h3>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h4>
                    <p className="text-gray-500 mb-6">Start by browsing our services and booking your first service</p>
                    <button
                      onClick={() => window.location.href = '/services'}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {booking.serviceType || 'Service'}
                            </h4>
                            <p className="text-gray-600">
                              Provider: {booking.providerName || 'Provider'}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {new Date(booking.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                              booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            } mb-2 inline-block`}>
                              {booking.status}
                            </span>
                            {booking.description && (
                              <p className="text-sm text-gray-600 mt-2">
                                {booking.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Favorite Service Providers
                </h3>
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h4>
                  <p className="text-gray-500">Add providers to your favorites for quick access</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;