import { mutate } from "swr";
import { createFavorite, deleteFavorite } from "../features/api/favoriteApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../features/user/userSlice";

export const useFavorite = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  const handleCreate = async (postId) => {
    try {
      const response = await createFavorite(postId);

      // 特定の投稿のキャッシュを更新
      await mutate(
        `post/${postId}`,
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              favorite_count: response.favorite_count,
              favorited: response.favorited,
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
      console.error("Favorite creation failed:", {
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
      const response = await deleteFavorite(postId);

      // 特定の投稿のキャッシュを更新
      await mutate(
        `post/${postId}`,
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              favorite_count: response.favorite_count,
              favorited: response.favorited,
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
      console.error("Favorite deletion failed:", {
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
