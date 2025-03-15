import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../api/userApi";
import Cookies from "js-cookie";
import { api, SESSIONS_ENDPOINT } from "../../utils/api";

const getCurrentUserId = async () => {
  try {
    const accessToken = Cookies.get("_access_token");
    const client = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if (!accessToken || !client || !uid) {
      console.log("認証情報が不足しています");
      return null;
    }

    const headers = {
      "access-token": accessToken,
      client: client,
      uid: uid,
    };

    const res = await api.get(SESSIONS_ENDPOINT, { headers }).catch((error) => {
      console.error("セッション確認中にエラーが発生しました:", error);
      return { status: 401 };
    });

    if (res?.status === 200 && res?.data?.data?.id) {
      return res.data.data.id;
    }

    return null;
  } catch (error) {
    console.error("ユーザーID取得中にエラーが発生しました:", error);
    return null;
  }
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (userId) => {
  const response = await getUser(userId);
  const currentUserId = await getCurrentUserId();

  return {
    ...response,
    is_self: currentUserId === Number(userId),
  };
});

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async () => {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return null;
    const response = await getUser(currentUserId);
    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    currentUser: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
