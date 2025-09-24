import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class AuthApi extends HttpClient {
  constructor() {
    super(baseURL);
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${getTokenLocal()}`;
      config.headers["authkey"] = import.meta.env.VITE_AUTH_KEY;
      return config;
    });
  };

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (response) => {
        return Promise.resolve(response);
      }
    );
  };

  loginConfig = ApiRoutes.Auth.Login;
  SignupConfig = ApiRoutes.Auth.Signup;
  ForgetPasswordConfig = ApiRoutes.Auth.ForgetPassword;
  ResetPasswordConfig = ApiRoutes.Auth.ResetPassword;

  login = async (reqBody) => {
    return this.instance({
      method: this.loginConfig.Method,
      url: this.loginConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  signup = async (reqBody) => {
    return this.instance({
      method: this.SignupConfig.Method,
      url: this.SignupConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  forgotPassword = async (reqBody) => {
    return this.instance({
      method: this.ForgetPasswordConfig.Method,
      url: this.ForgetPasswordConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
  resetPassword = async (reqBody) => {
    return this.instance({
      method: this.ResetPasswordConfig.Method,
      url: this.ResetPasswordConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
}

export default AuthApi;
