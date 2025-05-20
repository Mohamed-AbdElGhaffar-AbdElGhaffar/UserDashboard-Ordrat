import { API_BASE_URL } from '@/config/base-url';
import axios from 'axios';
import { useGuardContext } from './GuardContext';
import { GetCookiesClient } from '../ui/getCookiesClient/GetCookiesClient';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    // const accessToken = localStorage.getItem('accessToken');
    const accessToken = GetCookiesClient('accessToken');    

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
 
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isTokenInvalid =
      error.response?.status === 500 &&
      error.response?.data?.message === 'Access token is invalid';

    const isUnauthorized = error.response?.status === 403;

    if (error.response && (isUnauthorized || isTokenInvalid) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = GetCookiesClient('refreshToken');
        if (!refreshToken) {
          window.location.href = '/signin';
          throw new Error('Refresh token not found.');
        }

        const refreshResponse = await axios.post(
          '/api/Auth/RefreshAccessToken',
          { refreshToken },
          { baseURL: API_BASE_URL }
        );

        console.log("refreshResponse.data.token: ", refreshResponse.data.accessToken);

        if (refreshResponse.status === 401) {
          // Token refresh failed
          localStorage.clear();
          Cookies.remove('shopId');
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          Cookies.remove('roles');
          Cookies.remove('branches');
          Cookies.remove('mainBranch');
          Cookies.remove('name');
          Cookies.remove('email');
          Cookies.remove('sellerId');
          Cookies.remove('userType');
          window.location.href = '/signin';
          throw new Error('Unauthorized');
        }

        const { setGuard } = useGuardContext();
        setGuard(true);
        
        // Update token in storage
        const newToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        Cookies.set('accessToken', newToken, { expires: 1, secure: true, sameSite: 'Lax', path: '/' });
        // ShopId.
        Cookies.set('shopId', refreshResponse.data.shopId, {expires: 1, secure: true, sameSite: 'Lax', path: '/', });
        // (optional) Save refresh token
        Cookies.set('refreshToken', refreshResponse.data.refreshToken, { expires: 1, secure: true, sameSite: 'Lax', path: '/', });
        // (optional) Save roles
        Cookies.set('roles', JSON.stringify(refreshResponse.data.roles), { expires: 1, secure: true, sameSite: 'Lax', path: '/', });
        // (optional) Save roles
        Cookies.set('branches', JSON.stringify(refreshResponse.data.branches), { expires: 1, secure: true, sameSite: 'Lax', path: '/',});
        // (optional) Save roles
        Cookies.set('name', `${refreshResponse.data.firstName} ${refreshResponse.data.lastName}`, { expires: 1, secure: true, sameSite: 'Lax', path: '/', });
        // (optional) Save roles
        Cookies.set('email', refreshResponse.data.email, { expires: 1, secure: true, sameSite: 'Lax', path: '/', });
        // Update axios headers for future requests
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        Cookies.remove('shopId');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('roles');
        Cookies.remove('branches');
        Cookies.remove('mainBranch');
        Cookies.remove('name');
        Cookies.remove('email');
        Cookies.remove('sellerId');
        Cookies.remove('userType');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
