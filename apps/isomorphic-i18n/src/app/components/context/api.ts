import { API_BASE_URL } from '@/config/base-url';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create a standalone function for token refresh that doesn't depend on React hooks
const refreshAuthToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  const response = await axios.post(
    '/api/Auth/RefreshAccessToken',
    {},
    {
      baseURL: API_BASE_URL,
      headers: {
        'refreshToken': refreshToken,
      },
    }
  );

  if (response.data && response.data.accessToken) {
    // Save new tokens
    Cookies.set('accessToken', response.data.accessToken, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
    Cookies.set('refreshToken', response.data.refreshToken, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
    
    // Save other user data
    Cookies.set('shopId', response.data.shopId, {expires: 1, secure: true, sameSite: 'Lax', path: '/' });
    Cookies.set('roles', JSON.stringify(response.data.roles), { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
    Cookies.set('branches', JSON.stringify(response.data.branches), { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
    Cookies.set('name', `${response.data.firstName} ${response.data.lastName}`, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
    Cookies.set('email', response.data.email, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
    
    return response.data.accessToken;
  }
  
  throw new Error('Failed to refresh token');
};

// Create a helper function to clear auth data and redirect
const clearAuthAndRedirect = () => {
  localStorage.clear();
  // Remove all cookies at once
  const cookiesToRemove = [
    'shopId', 'accessToken', 'refreshToken', 'roles', 'branches', 
    'mainBranch', 'name', 'email', 'sellerId', 'userType'
  ];
  
  cookiesToRemove.forEach(cookie => {
    Cookies.remove(cookie);
  });
  
  window.location.href = '/signin';
};

// Create your axios client
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedRequestsQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; originalRequest: any; }[] = [];

// Request interceptor to add token to all requests
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is due to invalid token
    // Adjust these conditions based on your API error format
    const isTokenExpired = 
      (error.response?.status === 401) || 
      (error.response?.status === 403) ||
      (error.response?.status === 500 && 
       error.response?.data?.message === 'Access token is invalid');
    
    // Only proceed with refresh if this isn't already a retry and token is expired
    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If we're already refreshing, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, originalRequest });
        });
      }
      
      isRefreshing = true;
      
      try {
        // Get new token
        const newToken = await refreshAuthToken();
        
        // Process the queue of failed requests with the new token
        failedRequestsQueue.forEach(request => {
          request.originalRequest.headers.Authorization = `Bearer ${newToken}`;
          request.resolve(axiosClient(request.originalRequest));
        });
        
        failedRequestsQueue = [];
        
        // Update the original request and retry it
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;