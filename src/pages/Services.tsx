import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, MapPin, Clock, Phone, Mail, Filter, Grid, List, ChevronDown, Heart, Share2, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";

const Services: React.FC = () => {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // For now, we'll use search by location since we don't have a general get all providers endpoint
        const response = await apiService.searchByLocation('Chennai');
        if (response.success) {
          setProviders(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const categories = [
    "All Services",
    "Painting",
    "Electrical",
    "Plumbing",
    "Cleaning",
    "Gardening",
    "Technology",
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category
                  ? category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                  : "All Services"}
              </h1>
              <p className="text-gray-600 mt-1">
                Found {providers.length} services in Chennai
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={cat === "All Services" ? "/services" : `/services/${cat.toLowerCase().replace(" ", "-")}`}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      (cat === "All Services" && !category) ||
                      (category && cat.toLowerCase().replace(" ", "-") === category)
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          <div className="lg:w-3/4">
            {providers.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}>
                {providers.map((provider: any) => (
                  <div
                    key={provider.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-48"}`}>
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                          <Share2 className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      {provider.verified && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Verified
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {provider.name}
                        </h3>
                        <span className="text-lg font-bold text-blue-600">
                          ₹{provider.hourlyRate || 500}/hour
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{provider.description || 'Professional service provider'}</p>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900">
                            {provider.rating || 4.5}
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            (0 reviews)
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {provider.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {provider.experience || '2+'} years experience
                        </div>
                        <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {provider.serviceType || 'Service'}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/provider/${provider.id}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          View Profile
                        </Link>

                        {isAuthenticated ? (
                          <>
                            <button
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              title="Call Provider"
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                            <button
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              title="Email Provider"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/login"
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                              title="Login to view contact details"
                            >
                              <Lock className="h-4 w-4" />
                              <Phone className="h-4 w-4" />
                            </Link>
                            <Link
                              to="/login"
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                              title="Login to view contact details"
                            >
                              <Lock className="h-4 w-4" />
                              <Mail className="h-4 w-4" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;