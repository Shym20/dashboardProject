import { getTokenLocal } from "../../utils/localStorage.util";
import ApiRoutes from "../../configs/endpoints.config";
import HttpClient from "../index.api";
const baseURL = import.meta.env.VITE_API_URL;

class PlaylistApi extends HttpClient {
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

  GetVideosConfig = ApiRoutes.Playlist.GetVideos;
  GetAllPlaylistsConfig = ApiRoutes.Playlist.GetAllPlaylists;
  CreatePlaylistConfig = ApiRoutes.Playlist.CreatePlaylist;
  GetPlaylistDetailsConfig = ApiRoutes.Playlist.GetPlaylistDetails;
  EditPlaylistConfig = ApiRoutes.Playlist.EditPlaylist;
  DeletePlaylistConfig = ApiRoutes.Playlist.DeletePlaylist;

  getVideos = async (reqBody) => {
    return this.instance({
      method: this.GetVideosConfig.Method,
      url: this.GetVideosConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
  createPlaylist = async (reqBody) => {
    return this.instance({
      method: this.CreatePlaylistConfig.Method,
      url: this.CreatePlaylistConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
  getAllPlaylists = async (reqBody) => {
    return this.instance({
      method: this.GetAllPlaylistsConfig.Method,
      url: this.GetAllPlaylistsConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
  getPlaylistDetails = async (reqBody) => {
    return this.instance({
      method: this.GetPlaylistDetailsConfig.Method,
      url: this.GetPlaylistDetailsConfig.Endpoint(reqBody),
      headers: {},
      data: reqBody,
    });
  };
  editPlaylist = async (reqBody) => {
    return this.instance({
      method: this.EditPlaylistConfig.Method,
      url: this.EditPlaylistConfig.Endpoint,
      headers: {},
      data: reqBody,
    });
  };
  deletePlaylist = async (reqBody) => {
    return this.instance({
      method: this.DeletePlaylistConfig.Method,
      url: this.DeletePlaylistConfig.Endpoint(reqBody),
      headers: {},
      data: reqBody,
    });
  };
}

export default PlaylistApi;
