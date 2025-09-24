export const HttpMethod = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
};

const ApiRoutes = {
  Auth: {
    Login: {
      Endpoint: "/api/auth/login",
      Method: HttpMethod.Post,
    },
    Signup: {
      Endpoint: "/creator/auth/signup",
      Method: HttpMethod.Post,
    },
    ForgetPassword: {
      Endpoint: "/api/user/auth/forgetPassword",
      Method: HttpMethod.Post,
    },
    ResetPassword: {
      Endpoint: "/api/user/auth/reset-password",
      Method: HttpMethod.Post,
    },
  },
  Profile: {
    GetProfile: {
      Endpoint: "/api/creator/get-creator-profile",
      Method: HttpMethod.Get,
    },
    GetBankDetails: {
      Endpoint: "/api/creator/bank-account",
      Method: HttpMethod.Get,
    },
    UpdateProfile: {
      Method: HttpMethod.Put,
      Endpoint: "/api/creator/update-creator-profile",
    },
    UpdateBankDetails: {
      Method: HttpMethod.Post,
      Endpoint: "/api/creator/bank-account",
    },
  },
  Dashboard: {
    GetDashboard: {
      Endpoint: "/api/dashboard",
      Method: HttpMethod.Post,
    },
    GetTopVideos: {
      Endpoint: "/api/creator/top-videos",
      Method: HttpMethod.Get,
    },
    GetProducts: {
      Endpoint: "/api/product/get-all-products",
      Method: HttpMethod.Get,
    },
    DeleteProduct: {
      Endpoint: "/api/product/delete-product",
      Method: HttpMethod.Delete,
    },
    AddProduct: {
      Endpoint: "/api/product/create-product",
      Method: "POST",
    },
    UpdateProduct: {
      Endpoint: "/api/product/update-product",
      Method: "PATCH",
    },
    GetCategories: {
      Endpoint: "/api/product/category/get-all-categories",
      Method: HttpMethod.Get,
    },
    GetSubCategories: {
      Endpoint: "/api/product/subcategory/get-all-subcategories",
      Method: HttpMethod.Get,
    },
     AddCategories: {
      Endpoint: "/api/product/category/create-category",
      Method: "POST",
    },
     AddSubCategories: {
      Endpoint: "/api/product/subcategory/create-subcategory",
      Method: "POST",
    },
  },
  Playlist: {
    GetVideos: {
      Endpoint: "/api/video/creator/videos",
      Method: HttpMethod.Get,
    },
    CreatePlaylist: {
      Endpoint: "/api/playlist/create-playlist",
      Method: HttpMethod.Post,
    },
    GetAllPlaylists: {
      Endpoint: "/api/playlist/get-all-playlist",
      Method: HttpMethod.Post,
    },
    GetPlaylistDetails: {
      Endpoint: (playlistId) =>
        `/api/playlist/get-playlist-detail/${playlistId}`,
      Method: HttpMethod.Get,
    },
    EditPlaylist: {
      Endpoint: "/api/playlist/update-playlist",
      Method: HttpMethod.Patch,
    },
    DeletePlaylist: {
      Endpoint: (playlistId) => `/api/playlist/delete-playlist/${playlistId}`,
      Method: HttpMethod.Delete,
    },
  },
};

export default ApiRoutes;
