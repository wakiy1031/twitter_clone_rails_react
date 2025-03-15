import { mutate } from "swr";
import { createPost, uploadImage } from "../features/api/postApi";
import { POSTS_ENDPOINT } from "../utils/api";

export const usePost = () => {
  const handleSubmit = async (postData, imageData) => {
    try {
      const response = await createPost(postData);

      if (imageData && imageData.length > 0) {
        const formData = new FormData();
        imageData.forEach(({ file }) => formData.append("images[]", file));
        formData.append("post_id", response.data.id);
        await uploadImage(formData);
      }

      mutate(
        (key) => typeof key === "string" && key.startsWith(POSTS_ENDPOINT)
      );

      return response;
    } catch (error) {
      console.error("投稿作成エラー:", error);
      throw error;
    }
  };

  return { handleSubmit };
};
