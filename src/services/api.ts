// API service for backend communication
const API_BASE_URL = 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred'
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  // Authentication APIs
  async registerProvider(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register-provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async registerCustomer(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register-customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async login(credentials: { username: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return this.handleResponse(response);
  }

  // Admin APIs
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/get-users`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAllCustomers() {
    const response = await fetch(`${API_BASE_URL}/admin/get-customers`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getCustomer(customerId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/get-customers/${customerId}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAllProviders() {
    const response = await fetch(`${API_BASE_URL}/admin/get-providers`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getProvider(providerId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/get-providers/${providerId}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAllBookings() {
    const response = await fetch(`${API_BASE_URL}/admin/get-all/bookings`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Booking APIs
  async bookRequest(bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings/book-request`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return this.handleResponse(response);
  }

  async getBookedRequests() {
    const response = await fetch(`${API_BASE_URL}/bookings/get-booked-requests`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async acceptRequest(bookingId: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/accept-request/${bookingId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async rejectRequest(bookingId: string) {
    const response = await fetch(`${API_BASE_URL}/booking/reject-booking/${bookingId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAllReceivedRequests() {
    const response = await fetch(`${API_BASE_URL}/booking/all-received-requests`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async completeService(bookingId: string) {
    const response = await fetch(`${API_BASE_URL}/booking/complete/${bookingId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Customer APIs
  async updateCustomer(customerId: string, customerData: any) {
    const response = await fetch(`${API_BASE_URL}/customer/update-customer/${customerId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(customerData)
    });
    return this.handleResponse(response);
  }

  async getCustomerProfile(customerId: string) {
    const response = await fetch(`${API_BASE_URL}/customer/get-profile/${customerId}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async rateProvider(customerId: string, bookingId: string, rating: number) {
    const response = await fetch(`${API_BASE_URL}/customer/rate-provider/${customerId}/${bookingId}/${rating}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Provider APIs
  async updateProvider(providerId: string, providerData: any) {
    const response = await fetch(`${API_BASE_URL}/provider/update-provider/${providerId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(providerData)
    });
    return this.handleResponse(response);
  }

  async getProviderProfile(providerId: string) {
    const response = await fetch(`${API_BASE_URL}/provider/get-profile/${providerId}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async rateCustomer(providerId: string, bookingId: string, rating: number) {
    const response = await fetch(`${API_BASE_URL}/provider/rate-customer/${providerId}/${bookingId}/${rating}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Search APIs
  async searchProvider(providerId: string) {
    const response = await fetch(`${API_BASE_URL}/search/${providerId}`);
    return this.handleResponse(response);
  }

  async searchByLocation(location: string) {
    const response = await fetch(`${API_BASE_URL}/search/search-by-location/${location}`);
    return this.handleResponse(response);
  }

  async searchRelevant(location: string, serviceType: string) {
    const response = await fetch(`${API_BASE_URL}/search/search-relevant/${location}/${serviceType}`);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();