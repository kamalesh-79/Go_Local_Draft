import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Activity, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, customersResponse, providersResponse, bookingsResponse] = await Promise.all([
          apiService.getAllUsers(),
          apiService.getAllCustomers(),
          apiService.getAllProviders(),
          apiService.getAllBookings()
        ]);

        if (usersResponse.success) setUsers(usersResponse.data || []);
        if (customersResponse.success) setCustomers(customersResponse.data || []);
        if (providersResponse.success) setProviders(providersResponse.data || []);
        if (bookingsResponse.success) setBookings(bookingsResponse.data || []);
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
      icon: Users,
      label: "Total Users",
      value: users.length.toString(),
      change: "+12%",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Activity,
      label: "Active Bookings",
      value: bookings.filter((b: any) => b.status === 'ACCEPTED').length.toString(),
      change: "+8%",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: CheckCircle,
      label: "Completed Jobs",
      value: bookings.filter((b: any) => b.status === 'COMPLETED').length.toString(),
      change: "+15%",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Shield,
      label: "Verified Providers",
      value: providers.filter((p: any) => p.verified).length.toString(),
      change: "+5%",
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Manage your platform efficiently
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">Super Admin</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "users", label: "Users", icon: Users },
                { id: "bookings", label: "Bookings", icon: Activity },
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

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Recent Users
                    </h3>
                    <div className="space-y-4">
                      {users.slice(0, 5).map((user: any) => (
                        <div key={user.id} className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {user.name}
                              </h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'provider' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Recent Bookings
                    </h3>
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking: any) => (
                        <div key={booking.id} className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {booking.serviceType || 'Service'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {booking.customerName} → {booking.providerName}
                              </p>
                            </div>
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
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  User Management
                </h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.username}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'provider' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Booking Management
                </h3>
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {booking.serviceType || 'Service'}
                          </h4>
                          <p className="text-gray-600">
                            Customer: {booking.customerName} → Provider: {booking.providerName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                          {booking.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {booking.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;