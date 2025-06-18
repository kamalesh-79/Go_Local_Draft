import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Filter,
  Mic,
  Camera,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFilters } from "../contexts/FilterContext";

const PremiumSearchBar: React.FC = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { filters, updateFilter } = useFilters();

  const trendingServices = [
    { name: "Home Cleaning", icon: "🏠", trend: "+25%" },
    { name: "Plumbing", icon: "🔧", trend: "+18%" },
    { name: "Electrical Work", icon: "⚡", trend: "+22%" },
    { name: "Painting", icon: "🎨", trend: "+15%" },
    { name: "Gardening", icon: "🌱", trend: "+30%" },
    { name: "Tutoring", icon: "📚", trend: "+40%" },
  ];

  const quickFilters = [
    { name: "Available Now", color: "bg-green-500" },
    { name: "Top Rated", color: "bg-yellow-500" },
    { name: "Budget Friendly", color: "bg-blue-500" },
    { name: "Premium Service", color: "bg-purple-500" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.search.trim() || filters.location.trim()) {
      const params = new URLSearchParams();
      if (filters.search) params.append("q", filters.search);
      if (filters.location) params.append("location", filters.location);
      if (filters.category) params.append("category", filters.category);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.rating) params.append("rating", filters.rating);
      if (filters.availability)
        params.append("availability", filters.availability);

      navigate(`/search?${params.toString()}`);
    }
  };

  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      recognition.start();
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          updateFilter("location", "Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
      setShowFilters(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto relative dropdown-container">
      {/* Main Search Container */}
      <div className="search-premium rounded-3xl p-2 shadow-premium">
        <form onSubmit={handleSearch} className="flex items-center">
          {/* Service Search */}
          <div className="flex-1 flex items-center px-4">
            <Search className="h-6 w-6 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="What service do you need?"
              value={filters.search}
              onChange={(e) => {
                updateFilter("search", e.target.value);
                setShowSuggestions(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowSuggestions(true);
              }}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-700 placeholder-gray-500 font-medium"
            />

            {/* Voice Search */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-2 rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Location Search */}
          <div className="flex-1 flex items-center px-4">
            <MapPin className="h-6 w-6 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Enter your location"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-700 placeholder-gray-500 font-medium"
            />

            {/* GPS Location */}
            <button
              type="button"
              onClick={getCurrentLocation}
              className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              title="Use current location"
            >
              <Zap className="h-5 w-5" />
            </button>
          </div>

          {/* Filters */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFilters(!showFilters);
            }}
            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 mx-2"
          >
            <Filter className="h-6 w-6" />
          </button>

          {/* Search Button */}
          <button
            type="submit"
            className="btn-premium text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-glow hover-lift"
          >
            Search
          </button>
        </form>
      </div>

      {/* Trending Services */}
      {showSuggestions && (
        <div className="dropdown-content mt-4 p-6 animate-slide-down">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Trending Services</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {trendingServices.map((service, index) => (
              <button
                key={index}
                onClick={() => {
                  updateFilter("search", service.name);
                  setShowSuggestions(false);
                  navigate(
                    `/search?q=${encodeURIComponent(service.name)}&location=${encodeURIComponent(filters.location)}`,
                  );
                }}
                className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group hover-lift"
              >
                <span className="text-2xl mr-3">{service.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {service.name}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {service.trend}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Filters */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-700 mb-3">Quick Filters</h4>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-white text-sm font-medium ${filter.color} hover:opacity-80 transition-all duration-300 hover-scale`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="dropdown-content mt-4 p-6 animate-slide-down">
          <h3 className="font-semibold text-gray-900 mb-4">Advanced Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => updateFilter("priceRange", e.target.value)}
                className="w-full input-premium rounded-lg p-3 border-gray-300"
              >
                <option value="">Any Price</option>
                <option value="Under ₹500">Under ₹500</option>
                <option value="₹500 - ₹800">₹500 - ₹800</option>
                <option value="Over ₹800">Over ₹800</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => updateFilter("rating", e.target.value)}
                className="w-full input-premium rounded-lg p-3 border-gray-300"
              >
                <option value="">Any Rating</option>
                <option value="4+ Stars">4+ Stars</option>
                <option value="4.5+ Stars">4.5+ Stars</option>
                <option value="5 Stars">5 Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance
              </label>
              <select
                value={filters.distance}
                onChange={(e) => updateFilter("distance", e.target.value)}
                className="w-full input-premium rounded-lg p-3 border-gray-300"
              >
                <option value="">Any Distance</option>
                <option value="Within 1 km">Within 1 km</option>
                <option value="Within 5 km">Within 5 km</option>
                <option value="Within 10 km">Within 10 km</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => updateFilter("availability", e.target.value)}
                className="w-full input-premium rounded-lg p-3 border-gray-300"
              >
                <option value="">Any Time</option>
                <option value="Available Now">Available Now</option>
                <option value="Available Today">Available Today</option>
                <option value="Available This Week">Available This Week</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowFilters(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="btn-premium text-white px-6 py-2 rounded-lg hover-lift"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumSearchBar;
