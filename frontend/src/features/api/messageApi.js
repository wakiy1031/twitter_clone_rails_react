import { api } from "../../utils/api";

export const getMessages = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}/messages`);
  return response.data;
};
