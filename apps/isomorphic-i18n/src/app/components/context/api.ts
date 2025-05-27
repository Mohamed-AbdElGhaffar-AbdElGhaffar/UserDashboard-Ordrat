import { API_BASE_URL } from '@/config/base-url';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

/**
 * Refresh access token function
 */
const refreshAuthToken = async (): Promise<string> => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/Auth/RefreshAccessToken`,
      {},
      {
        headers: {
          'refreshToken': refreshToken,
          'Content-Type': 'application/json'
        },
      }
    );

    if (response.data && response.data.accessToken) {
      // Save new tokens
      Cookies.set('accessToken', response.data.accessToken, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
      Cookies.set('refreshToken', response.data.refreshToken, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
      
      // Save other user data
      if (response.data.shopId) {
        Cookies.set('shopId', response.data.shopId, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
      }
      if (response.data.roles) {
        Cookies.set('roles', JSON.stringify(response.data.roles), { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
      }
      if (response.data.branches) {
        Cookies.set('branches', JSON.stringify(response.data.branches), { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
      }
      if (response.data.firstName && response.data.lastName) {
        Cookies.set('name', `${response.data.firstName} ${response.data.lastName}`, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
      }
      if (response.data.email) {
        Cookies.set('email', response.data.email, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
      }
      
      return response.data.accessToken;
    }
    
    throw new Error('Failed to refresh token: Invalid response format');
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Failed to refresh token');
  }
};

/**
 * Clear auth data and redirect
 */
const clearAuthAndRedirect = (): void => {
  localStorage.clear();
  const cookiesToRemove = [
    'shopId', 'accessToken', 'refreshToken', 'roles', 'branches', 
    'mainBranch', 'name', 'email', 'sellerId', 'userType'
  ];
  
  cookiesToRemove.forEach(cookie => {
    Cookies.remove(cookie, { path: '/' });
  });
  
  if (!window.location.pathname.includes('/signin')) {
    window.location.href = '/signin';
  }
};

/**
 * Type guard for error messages
 */
const hasErrorMessage = (data: any): data is { message: string } => {
  return data && typeof data === 'object' && 'message' in data && typeof data.message === 'string';
};

/**
 * Create axios client
 */
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

/**
 * Token refresh state management
 */
let isRefreshing = false;

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}

let failedRequestsQueue: QueueItem[] = [];

/**
 * Process queued requests
 */
const processQueue = (error: Error | null, token: string | null = null): void => {
  failedRequestsQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      if (token && request.config.headers) {
        request.config.headers.Authorization = `Bearer ${token}`;
      }
      request.resolve(axiosClient(request.config));
    }
  });
  
  failedRequestsQueue = [];
};

/**
 * Request interceptor
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = Cookies.get('accessToken');    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  async (error: any) => {
    const originalConfig = error.config as AxiosRequestConfig;
    
    console.error(`❌ ${originalConfig?.method?.toUpperCase()} ${originalConfig?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    if (!originalConfig) {
      return Promise.reject(error);
    }

    // Check if token is expired
    const isTokenExpired = 
      (error.response?.status === 401) || 
      (error.response?.status === 403) ||
      (error.response?.status === 500 && 
       hasErrorMessage(error.response?.data) && 
       error.response.data.message === 'Access token is invalid');
    
    // Handle token refresh
    if (isTokenExpired && originalConfig && !(originalConfig as any)._retry) {
      (originalConfig as any)._retry = true;
      
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
        const newToken = await refreshAuthToken();
        processQueue(null, newToken);
        
        const newRequestConfig = { ...originalConfig };
        if (newRequestConfig.headers) {
          newRequestConfig.headers.Authorization = `Bearer ${newToken}`;
        }
        
        return axiosClient(newRequestConfig);
      } catch (refreshError) {
        processQueue(refreshError as Error);
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