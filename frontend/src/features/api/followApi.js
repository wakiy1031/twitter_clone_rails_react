import { api } from "../../utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const followUser = createAsyncThunk("user/follow", async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
});

export const unfollowUser = createAsyncThunk(
  "user/unfollow",
  async (userId) => {
    const response = await api.delete(`/users/${userId}/unfollow`);
    return response.data;
  }
);
