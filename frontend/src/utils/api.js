import axios from "axios";
import Cookies from "js-cookie";

export const BASE_URL = "http://localhost:3000";
const DEFAULT_API_LOCALHOST = "http://localhost:3000/api/v1";
export const SESSIONS_ENDPOINT = `${DEFAULT_API_LOCALHOST}/auth/sessions`;
export const IMAGES_ENDPOINT = `${DEFAULT_API_LOCALHOST}/images`;
export const POSTS_ENDPOINT = `${DEFAULT_API_LOCALHOST}/tweets`;
export const USERS_ENDPOINT = `${DEFAULT_API_LOCALHOST}/users`;
export const PROFILE_ENDPOINT = `${DEFAULT_API_LOCALHOST}/profile`;
export const COMMENTS_ENDPOINT = `${DEFAULT_API_LOCALHOST}/comments`;
export const NOTIFICATIONS_ENDPOINT = `${DEFAULT_API_LOCALHOST}/notifications`;
export const ROOMS_ENDPOINT = `${DEFAULT_API_LOCALHOST}/rooms`;
export const BOOKMARKS_ENDPOINT = `${DEFAULT_API_LOCALHOST}/bookmarks`;

export const api = axios.create({
  baseURL: DEFAULT_API_LOCALHOST,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("_access_token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if (accessToken && client && uid) {
      config.headers["access-token"] = accessToken;
      config.headers["client"] = client;
      config.headers["uid"] = uid;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
