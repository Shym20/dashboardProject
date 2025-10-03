import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class DashboardApi extends HttpClient {
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

  getDashboardConfig = ApiRoutes.Dashboard.GetDashboard;
  getTopVideosConfig = ApiRoutes.Dashboard.GetTopVideos;
  getProductsConfig = ApiRoutes.Dashboard.GetProducts;
  deleteProductConfig = ApiRoutes.Dashboard.DeleteProduct;
  addProductConfig = ApiRoutes.Dashboard.AddProduct;
  getCategoriesConfig = ApiRoutes.Dashboard.GetCategories;
  getSubCategoriesConfig = ApiRoutes.Dashboard.GetSubCategories;
  updateProductConfig = ApiRoutes.Dashboard.UpdateProduct;
  addCategoryConfig = ApiRoutes.Dashboard.AddCategories;
  addSubCategoryConfig = ApiRoutes.Dashboard.AddSubCategories;

  getDashboard = async (reqBody) => {
    return this.instance({
      method: this.getDashboardConfig.Method,
      url: this.getDashboardConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
  getTopVideos = async (reqBody) => {
    return this.instance({
      method: this.getTopVideosConfig.Method,
      url: this.getTopVideosConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
 getProducts = async (page = 1, limit = 10, category = "", subcategory = "") => {
  let url = `${this.getProductsConfig.Endpoint}?page=${page}&limit=${limit}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (subcategory) url += `&subcategory=${encodeURIComponent(subcategory)}`;

  return this.instance({
    method: this.getProductsConfig.Method,
    url,
    headers: {},
  });
};


deleteProduct = async (productId) => {
  return this.instance({
    method: this.deleteProductConfig.Method, // Use DeleteProductConfig
    url: `${this.deleteProductConfig.Endpoint}/${productId}`, // append ID to URL
    headers: {},
  });
};
addProduct = async (formData) => {
  return this.instance({
    method: "POST", // should be POST, not DELETE
    url: this.addProductConfig.Endpoint,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
updateProduct = async (productId, formData) => {
  return this.instance({
    method: "PATCH",
    url: `${this.updateProductConfig.Endpoint}/${productId}`, // ID in params
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
 getCategories = async () => {
    return this.instance({
      method: this.getCategoriesConfig.Method,
      url: this.getCategoriesConfig.Endpoint,
      headers: {},
     
    });
  };
   getSubCategories = async () => {
    return this.instance({
      method: this.getSubCategoriesConfig.Method,
      url: this.getSubCategoriesConfig.Endpoint,
      headers: {},
    });
  };

 addCategory = async (body) => {
  return this.instance({
    method: "POST",
    url: this.addCategoryConfig.Endpoint,
    data: body,
    headers: {
      "Content-Type": "application/json",  // correct for your curl
    },
  });
};

addSubCategory = async (body) => {
  return this.instance({
    method: "POST",
    url: this.addSubCategoryConfig.Endpoint,
    data: body,
    headers: {
      "Content-Type": "application/json",
    },
  });
};




}

export default DashboardApi;
