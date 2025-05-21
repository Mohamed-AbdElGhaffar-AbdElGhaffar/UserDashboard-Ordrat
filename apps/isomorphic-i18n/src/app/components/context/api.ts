import { API_BASE_URL } from '@/config/base-url';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Create a standalone function for token refresh that doesn't depend on React hooks
const refreshAuthToken = async (): Promise<string> => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  try {
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
    
    throw new Error('Failed to refresh token: Invalid response format');
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Failed to refresh token');
  }
};

// Create a helper function to clear auth data and redirect
const clearAuthAndRedirect = (): void => {
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

// Type guard function to check if the error response has a message
const hasErrorMessage = (data: any): data is { message: string } => {
  return data && typeof data === 'object' && 'message' in data && typeof data.message === 'string';
};

// Create your axios client
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;

// Queue for storing pending requests that should be retried after token refresh
interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}

let failedRequestsQueue: QueueItem[] = [];

// Process all requests in the queue with the new token
const processQueue = (error: Error | null, token: string | null = null): void => {
  failedRequestsQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      // Set the new token in the request
      if (token && request.config.headers) {
        request.config.headers.Authorization = `Bearer ${token}`;
      }
      // Retry the request with the new token
      request.resolve(axiosClient(request.config));
    }
  });
  
  // Clear the queue
  failedRequestsQueue = [];
};

// Request interceptor to add token to all requests
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get('accessToken');    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Save the original request configuration
    const originalConfig = error.config as AxiosRequestConfig;
    
    if (!originalConfig) {
      return Promise.reject(error);
    }

    // Check if the error is due to invalid token using type guard
    const isTokenExpired = 
      (error.response?.status === 401) || 
      (error.response?.status === 403) ||
      (error.response?.status === 500 && 
       hasErrorMessage(error.response?.data) && 
       error.response.data.message === 'Access token is invalid');
    
    // Only proceed with refresh if this isn't already a retry and token is expired
    if (isTokenExpired && originalConfig && !(originalConfig as any)._retry) {
      // Mark this request as retried
      (originalConfig as any)._retry = true;
      
      // If we're already refreshing, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve, 
            reject,
            config: originalConfig
          });
        });
      }
      
      isRefreshing = true;
      
      try {
        // Get new token
        const newToken = await refreshAuthToken();
        
        // Process pending requests
        processQueue(null, newToken);
        
        // Create a new request with the refreshed token
        const newRequestConfig = { ...originalConfig };
        if (newRequestConfig.headers) {
          newRequestConfig.headers.Authorization = `Bearer ${newToken}`;
        }
        
        // Make a fresh request with the new token
        return axiosClient(newRequestConfig);
      } catch (refreshError) {
        // Process queue with error
        processQueue(refreshError as Error);
        
        // Clear auth and redirect to login
        clearAuthAndRedirect();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // If the error is not related to authentication or the retry has already happened
    return Promise.reject(error);
  }
);

export default axiosClient;