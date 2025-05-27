import { API_BASE_URL } from '@/config/base-url';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

/**
 * Types and Interfaces
 */
interface TokenData {
  accessToken: string;
  refreshToken: string;
  shopId?: string;
  roles?: string[];
  branches?: any[];
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  config: AxiosRequestConfig;
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Cookie Management Utility
 */
class CookieManager {
  private static readonly COOKIE_OPTIONS = {
    expires: 1,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax' as const,
    path: '/'
  };

  static set(key: string, value: string): void {
    Cookies.set(key, value, this.COOKIE_OPTIONS);
  }

  static get(key: string): string | undefined {
    return Cookies.get(key);
  }

  static remove(key: string): void {
    Cookies.remove(key, { path: '/' });
  }

  static clearAll(): void {
    const cookiesToClear = [
      'accessToken', 'refreshToken', 'shopId', 'roles', 'branches',
      'name', 'email', 'sellerId', 'userType', 'mainBranch'
    ];
    
    cookiesToClear.forEach(cookie => this.remove(cookie));
  }

  static saveTokenData(data: TokenData): void {
    this.set('accessToken', data.accessToken);
    this.set('refreshToken', data.refreshToken);
    
    if (data.shopId) this.set('shopId', data.shopId);
    if (data.roles) this.set('roles', JSON.stringify(data.roles));
    if (data.branches) this.set('branches', JSON.stringify(data.branches));
    if (data.firstName && data.lastName) {
      this.set('name', `${data.firstName} ${data.lastName}`);
    }
    if (data.email) this.set('email', data.email);
  }
}

/**
 * Token Refresh Manager
 */
class TokenRefreshManager {
  private isRefreshing = false;
  private requestQueue: QueuedRequest[] = [];
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async refreshToken(): Promise<string> {
    const refreshToken = CookieManager.get('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<TokenData>(
        `${API_BASE_URL}/api/Auth/RefreshAccessToken`,
        {},
        {
          headers: {
            'refreshToken': refreshToken,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (!response.data?.accessToken) {
        throw new Error('Invalid token response format');
      }

      // Save new token data
      CookieManager.saveTokenData(response.data);
      
      return response.data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  async handleTokenRefresh(originalRequest: AxiosRequestConfig): Promise<any> {
    // If already refreshing, queue the request
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    this.isRefreshing = true;

    try {
      // Refresh the token
      const newAccessToken = await this.refreshToken();
      
      // Process queued requests with new token
      this.processQueue(null, newAccessToken);
      
      // Retry original request with new token
      return this.retryRequestWithNewToken(originalRequest, newAccessToken);
      
    } catch (error) {
      // Process queue with error
      this.processQueue(error as Error);
      
      // Clear auth data and redirect
      this.handleAuthFailure();
      
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: Error | null, token?: string): void {
    this.requestQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else if (token) {
        // Add new token to request headers
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
        resolve(this.retryRequestWithNewToken(config, token));
      }
    });

    this.requestQueue = [];
  }

  private async retryRequestWithNewToken(config: AxiosRequestConfig, token: string): Promise<any> {
    const newConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    };

    return this.client.request(newConfig);
  }

  private handleAuthFailure(): void {
    CookieManager.clearAll();
    localStorage.clear();
    
    // Prevent redirect loops
    if (!window.location.pathname.includes('/signin')) {
      window.location.href = '/signin';
    }
  }
}

/**
 * Enhanced Axios Client
 */
class ApiClient {
  private client: AxiosInstance;
  private tokenManager: TokenRefreshManager;

  constructor() {
    this.client = this.createAxiosInstance();
    this.tokenManager = new TokenRefreshManager(this.client);
    this.setupInterceptors();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const accessToken = CookieManager.get('accessToken');
        
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };
        
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses
        // const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();
        console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config;
        
        // Log error details
        console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        });

        // Handle authentication errors
        if (this.isAuthenticationError(error) && originalRequest && !originalRequest._isRetry) {
          originalRequest._isRetry = true;
          
          try {
            return await this.tokenManager.handleTokenRefresh(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        // Transform error for better handling
        return Promise.reject(this.transformError(error));
      }
    );
  }

  private isAuthenticationError(error: AxiosError<ApiError>): boolean {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    return (
      status === 401 ||
      status === 403 ||
      (status === 500 && message === 'Access token is invalid')
    );
  }

  private transformError(error: AxiosError<ApiError>): Error {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message || 'An unexpected error occurred';

    const transformedError = new Error(message) as any;
    transformedError.status = status;
    transformedError.data = data;
    transformedError.originalError = error;

    return transformedError;
  }

  // Public API methods
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Utility method for form data requests
  async postFormData<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async putFormData<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

// Export singleton instance
const axiosClient = new ApiClient();

// Type augmentation for axios config
declare module 'axios' {
  interface AxiosRequestConfig {
    _isRetry?: boolean;
    metadata?: {
      startTime: Date;
    };
  }
}

export default axiosClient;

// Export utilities for advanced usage
export { CookieManager, TokenRefreshManager };