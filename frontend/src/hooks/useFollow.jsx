import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../features/api/followApi";
import { mutate } from "swr";
import { fetchUser } from "../features/user/userSlice";

export const useFollow = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  const handleFollow = async (userId) => {
    try {
      const response = await dispatch(followUser(userId)).unwrap();
      await mutate(`user/${userId}`, (currentData) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          data: { ...currentData.data, is_following: true },
        };
      });

      if (currentUser?.id) {
        await dispatch(fetchUser(currentUser.id)).unwrap();
      }

      return response;
    } catch (error) {
      console.error("フォローに失敗しました:", error);
      throw error;
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const response = await dispatch(unfollowUser(userId)).unwrap();
      await mutate(`user/${userId}`, (currentData) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          data: { ...currentData.data, is_following: false },
        };
      });

      if (currentUser?.id) {
        await dispatch(fetchUser(currentUser.id)).unwrap();
      }

      return response;
    } catch (error) {
      console.error("フォロー解除に失敗しました:", error);
      throw error;
    }
  };

  return { handleFollow, handleUnfollow };
};
