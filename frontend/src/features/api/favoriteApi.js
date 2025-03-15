import { api } from "../../utils/api";

export const createFavorite = async (id) => {
  const response = await api.post(`/tweets/${id}/favorites`);
  return response.data;
};

export const deleteFavorite = async (id) => {
  const response = await api.delete(`/tweets/${id}/favorites`);
  return response.data;
};
