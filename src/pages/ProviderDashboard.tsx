import React, { useState, useEffect } from "react";
import { Star, Calendar, DollarSign, Users, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsResponse = await apiService.getAllReceivedRequests();
        if (requestsResponse.success) {
          setRequests(requestsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcceptRequest = async (bookingId: string) => {
    try {
      const response = await apiService.acceptRequest(bookingId);
      if (response.success) {
        // Refresh the requests
        const requestsResponse = await apiService.getAllReceivedRequests();
        if (requestsResponse.success) {
          setRequests(requestsResponse.data || []);
        }
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (bookingId: string) => {
    try {
      const response = await apiService.rejectRequest(bookingId);
      if (response.success) {
        // Refresh the requests
        const requestsResponse = await apiService.getAllReceivedRequests();
        if (requestsResponse.success) {
          setRequests(requestsResponse.data || []);
        }
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const stats = [
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: "₹0",
      change: "+0%",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Users,
      label: "Total Customers",
      value: "0",
      change: "+0%",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: CheckCircle,
      label: "Completed Jobs",
      value: "0",
      change: "+0%",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: user?.rating?.toString() || "0",
      change: "+0",
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
            Manage your services and track your performance
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">
                {user?.rating || 0} rating
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Verified Provider</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "requests", label: "Requests", icon: Calendar },
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
                        <span className={`text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Requests */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Recent Requests
                  </h3>
                  {requests.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No requests yet</p>
                      <p className="text-sm text-gray-400">Requests will appear here when customers book your services</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.slice(0, 5).map((request: any) => (
                        <div key={request.id} className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {request.serviceType || 'Service Request'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Customer: {request.customerName || 'Customer'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                request.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {request.status}
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

            {activeTab === "requests" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  All Requests
                </h3>
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h4>
                    <p className="text-gray-500">Requests from customers will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request: any) => (
                      <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {request.serviceType || 'Service Request'}
                            </h4>
                            <p className="text-gray-600">
                              Customer: {request.customerName || 'Customer'}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {new Date(request.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            {request.description && (
                              <p className="text-sm text-gray-600 mt-2">
                                {request.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                              request.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            } mb-2 inline-block`}>
                              {request.status}
                            </span>
                            {request.status === 'PENDING' && (
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={() => handleAcceptRequest(request.id)}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(request.id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;