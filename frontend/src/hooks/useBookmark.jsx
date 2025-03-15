import { mutate } from "swr";
import { createBookmark, deleteBookmark } from "../features/api/bookmarkApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../features/user/userSlice";

export const useBookmark = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  const handleCreate = async (postId) => {
    try {
      const response = await createBookmark(postId);

      // 特定の投稿のキャッシュを更新
      await mutate(
        `post/${postId}`,
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              bookmarked: true,
            },
          };
        },
        false
      );

      // ブックマーク一覧を更新
      await mutate("bookmarks");

      // Reduxのユーザー情報を再取得して更新
      if (currentUser?.id) {
        await dispatch(fetchUser(currentUser.id)).unwrap();
      }

      return response;
    } catch (error) {
      console.error("Bookmark creation failed:", {
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
      const response = await deleteBookmark(postId);

      // 特定の投稿のキャッシュを更新
      await mutate(
        `post/${postId}`,
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              bookmarked: false,
            },
          };
        },
        false
      );

      // ブックマーク一覧を更新
      await mutate("bookmarks");

      // Reduxのユーザー情報を再取得して更新
      if (currentUser?.id) {
        await dispatch(fetchUser(currentUser.id)).unwrap();
      }

      return response;
    } catch (error) {
      console.error("Bookmark deletion failed:", {
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
