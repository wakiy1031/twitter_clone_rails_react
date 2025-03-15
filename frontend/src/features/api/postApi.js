import { api, POSTS_ENDPOINT, IMAGES_ENDPOINT } from "../../utils/api";

export const getPosts = async (data) => {
  const response = await api.get(POSTS_ENDPOINT, data);
  return response.data;
};

export const createPost = async (data) => {
  const response = await api.post(POSTS_ENDPOINT, data);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`${POSTS_ENDPOINT}/${id}`);
  return response.data;
};

export const uploadImage = async (data) => {
  try {
    const response = await api.post(IMAGES_ENDPOINT, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "画像アップロードエラー:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchPost = async (id) => {
  const response = await api.get(`${POSTS_ENDPOINT}/${id}`);
  return response.data;
};
