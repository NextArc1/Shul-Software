// Centralized API utility for consistent authentication and error handling

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

class ApiService {
  static async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` }),
        ...options.headers,
      },
    };

    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, config);
      
      // Handle unauthorized responses
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      
      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // For validation errors (400), preserve the full error object
        if (response.status === 400 && typeof errorData === 'object' && !errorData.detail) {
          const error = new Error('Validation failed');
          error.errors = errorData;
          error.status = response.status;
          throw error;
        }

        // For other errors, use detail or error message
        throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Return JSON response for responses with content
      // 204 No Content (common for DELETE) has no body to parse
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Convenience methods
  static get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default ApiService;

// Export convenience functions
export const api = {
  get: ApiService.get.bind(ApiService),
  post: ApiService.post.bind(ApiService),
  put: ApiService.put.bind(ApiService),
  patch: ApiService.patch.bind(ApiService),
  delete: ApiService.delete.bind(ApiService),
};