import { api, ROOMS_ENDPOINT } from "../../utils/api";

export const getRooms = async () => {
  const response = await api.get(ROOMS_ENDPOINT);
  return response.data;
};

export const createRoom = async (data) => {
  const response = await api.post(ROOMS_ENDPOINT, data);
  return response.data;
};
