import { mutate } from "swr";
import { createRepost, deleteRepost } from "../features/api/repostApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../features/user/userSlice";

export const useRepost = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  const handleCreate = async (postId) => {
    try {
      const response = await createRepost(postId);

      // 特定の投稿のキャッシュを更新
      await mutate(
        `post/${postId}`,
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              repost_count: response.repost_count,
              reposted: response.reposted,
            },
          };
        },
        false
      );

      // Reduxのユーザー情報を再取得して更新
      if (currentUser?.id) {
        await dispatch(fetchUser(currentUser.id)).unwrap();
      }

      return response;
    } catch (error) {
      console.error("Repost creation failed:", {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        postId,
      });
      throw error;
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await deleteRepost(postId);

      // 特定の投稿のキャッシュを更新
      await mutate(
        `post/${postId}`,
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              repost_count: response.repost_count,
              reposted: response.reposted,
            },
          };
        },
        false
      );

      // Reduxのユーザー情報を再取得して更新
      if (currentUser?.id) {
        await dispatch(fetchUser(currentUser.id)).unwrap();
      }

      return response;
    } catch (error) {
      console.error("Repost deletion failed:", {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        postId,
      });
      throw error;
    }
  };

  return { handleCreate, handleDelete };
};
