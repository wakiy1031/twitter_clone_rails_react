import { api, NOTIFICATIONS_ENDPOINT } from "../../utils/api";

export const getNotifications = async () => {
  const response = await api.get(NOTIFICATIONS_ENDPOINT);
  return response.data;
};
