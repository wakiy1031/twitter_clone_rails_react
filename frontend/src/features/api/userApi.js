import { api, USERS_ENDPOINT } from "../../utils/api";

export const getUser = async (id) => {
  const response = await api.get(`${USERS_ENDPOINT}/${id}`);
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const formData = new FormData();

  // フォームデータの構築
  Object.keys(userData).forEach((key) => {
    if (key === "avatar_image" || key === "header_image") {
      if (userData[key] instanceof File) {
        // ファイルが存在する場合はアップロード
        formData.append(`user[${key}]`, userData[key]);
      } else if (userData[key] === null) {
        // nullの場合は削除フラグを送信
        formData.append(`user[remove_${key}]`, "true");
      }
    } else if (userData[key] !== undefined && userData[key] !== null) {
      formData.append(`user[${key}]`, userData[key]);
    }
  });

  // デバッグ用：送信するデータの確認
  for (let pair of formData.entries()) {
    console.log("送信データ:", pair[0], pair[1]);
  }

  try {
    const response = await api.patch("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("APIエラー詳細:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};
