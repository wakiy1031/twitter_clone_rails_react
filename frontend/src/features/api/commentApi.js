import { api, COMMENTS_ENDPOINT, POSTS_ENDPOINT } from "../../utils/api";

export const getComments = async (tweetId) => {
  const response = await api.get(`${POSTS_ENDPOINT}/${tweetId}/comments`);
  return response.data;
};

export const createComment = async (data) => {
  const response = await api.post(COMMENTS_ENDPOINT, data);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`${COMMENTS_ENDPOINT}/${commentId}`);
  return response.data;
};

// コメントの画像アップロード用の関数を追加
export const uploadCommentImages = async (commentId, images) => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("images[]", image);
  });

  const response = await api.post(
    `${COMMENTS_ENDPOINT}/${commentId}/upload_images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
