import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Upload, User, Mail, Phone, MapPin } from 'lucide-react';

const SignupCustomer: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'helper' | 'customer'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    location: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Customer registration:', formData);
    alert('Registration successful! Welcome to Go Local.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-200 opacity-30 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 opacity-40 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 opacity-35 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Local Services
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with trusted professionals in your neighborhood
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl mb-8 max-w-xs mx-auto shadow-lg">
          <div className="grid grid-cols-2 gap-1">
            <Link
              to="/signup/helper"
              className="py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 text-center"
            >
              🔧 Service Provider
            </Link>
            <button
              onClick={() => setUserType('customer')}
              className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                userType === 'customer'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👤 Customer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100 to-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
            
            <div className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/80"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/80"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Email and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/80"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/80"
                        placeholder="Your city/area"
                      />
                    </div>
                  </div>
                </div>

                {/* Photo and Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="photo"
                        className="w-full flex items-center justify-center px-3 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-white/80"
                      >
                        <Upload className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-600">Upload Photo</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/80"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/80"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/80"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account? {' '}
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="relative inline-block mb-8">
                <img
                  src="https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Happy customer"
                  className="w-80 h-80 object-cover rounded-3xl shadow-2xl animate-float"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-2xl shadow-lg animate-bounce">
                  ⭐
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 p-4 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold text-indigo-600">50K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Discover Trusted Services
              </h3>
              <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
                Connect with verified professionals in your area. From home repairs to 
                personal services, find exactly what you need with confidence and ease.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">24/7</div>
                  <div className="text-gray-600">Customer Support</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">15K+</div>
                  <div className="text-gray-600">Verified Providers</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">4.9★</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">Safe</div>
                  <div className="text-gray-600">Secure Payments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupCustomer;