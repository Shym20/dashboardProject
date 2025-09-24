import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class ProfileApi extends HttpClient {
  constructor() {
    super(baseURL);
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${getTokenLocal()}`;
      config.headers["ngrok-skip-browser-warning"] = `true`;

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

  getProfileConfig = ApiRoutes.Profile.GetProfile;
  updateProfileConfig = ApiRoutes.Profile.UpdateProfile;
  getBankDetailsConfig = ApiRoutes.Profile.GetBankDetails;
  updateBankDetailsConfig = ApiRoutes.Profile.UpdateBankDetails;

  getProfile = async (reqBody) => {
    return this.instance({
      method: this.getProfileConfig.Method,
      url: this.getProfileConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  getBankDetails = async (reqBody) => {
    return this.instance({
      method: this.getBankDetailsConfig.Method,
      url: this.getBankDetailsConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };

  updateProfile = async (updateData) => {
    return this.instance({
      method: this.updateProfileConfig.Method,
      url: this.updateProfileConfig.Endpoint,
      headers: {},
      data: updateData,
    });
  };
  updateBankDetails = async (updateData) => {
    return this.instance({
      method: this.updateBankDetailsConfig.Method,
      url: this.updateBankDetailsConfig.Endpoint,
      headers: {},
      data: updateData,
    });
  };
}

export default ProfileApi;
