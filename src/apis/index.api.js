import axios from "axios";
// Optional: Uncomment below line if you use toast notifications
// import { toast } from "react-toastify";
const baseURL = import.meta.env.VITE_API_URL;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export class HttpClient {
  constructor(baseURL) {
    this.instance = axios.create({ baseURL });
    this._initializeResponseInterceptor();
  }

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  _handleResponse = (response) => {
    const { data } = response;

    // Optional: Uncomment for global toast messages
    /*
    if (data.status === "success") {
      toast.success(capitalize(data.message) || "Request successful!");
    } else if (data.status === "fail" || data.status === "error") {
      toast.error(capitalize(data.message) || "Something went wrong!");
    }
    */
    return data;
  };

  _handleError = async ({ response, config }) => {
    const originalRequest = config;

    // Optional: Retry logic for 401 Unauthorized
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // toast.error("Session expired! Please log in again.");
      return this.instance(originalRequest);
    }

    // Optional: Show error message
    // toast.error(response?.data?.message || "An unexpected error occurred!");

    return Promise.reject(response);
  };
}

export default HttpClient;
