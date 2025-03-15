import { api } from "../../utils/api";

export const createRepost = async (id) => {
  const response = await api.post(`/tweets/${id}/retweets`);
  return response.data;
};

export const deleteRepost = async (id) => {
  const response = await api.delete(`/tweets/${id}/retweets`);
  return response.data;
};
