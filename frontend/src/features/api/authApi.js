import { api, SESSIONS_ENDPOINT } from "../../utils/api";
import Cookies from "js-cookie";

export const signUp = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Sign up error:", error.response?.data);
    if (error.response?.data?.errors) {
      throw { errors: error.response.data.errors };
    } else {
      throw new Error(
        error.response?.data?.error || "登録時にエラーが発生しました"
      );
    }
  }
};

export const initializeCurrentUser = async () => {
  const accessToken = Cookies.get("_access_token");
  const client = Cookies.get("_client");
  const uid = Cookies.get("_uid");

  if (!accessToken || !client || !uid) {
    return null;
  }

  try {
    const res = await api.get(SESSIONS_ENDPOINT, {
      headers: {
        "access-token": accessToken,
        client: client,
        uid: uid,
      },
    });

    if (res.status === 200) {
      return res.data.data;
    } else {
      console.error(
        "ユーザー情報の取得に失敗しました。ステータスコード:",
        res.status
      );
      return null;
    }
  } catch (error) {
    console.error("ユーザー情報の取得中にエラーが発生しました:", error);
    return null;
  }
};

export const logIn = async (userData) => {
  try {
    const response = await api.post("/users/sign_in", userData);
    return response.data;
  } catch (error) {
    console.error("ログインに失敗しました:", error.response?.data);
    throw error;
  }
};
