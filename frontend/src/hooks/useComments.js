import useSWR, { mutate as globalMutate } from "swr";
import { getComments } from "../features/api/commentApi";

const getCommentsKey = (postId) => (postId ? `comments-${postId}` : null);

export const useComments = (postId) => {
  const key = getCommentsKey(postId);

  const {
    data,
    error,
    isLoading,
    mutate: boundMutate,
  } = useSWR(
    key,
    async () => {
      const response = await getComments(postId);
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
      suspense: false,
      revalidateIfStale: false,
    }
  );

  const refreshComments = async () => {
    if (!postId) {
      console.warn("postIdが指定されていません");
      return;
    }

    const cacheKey = getCommentsKey(postId);

    try {
      // 新しいデータを取得
      const response = await getComments(postId);

      // キャッシュを更新
      await boundMutate(response, false);
      await globalMutate(cacheKey, response, false);

      return response;
    } catch (error) {
      console.error("refreshComments エラー:", error);
      throw error;
    }
  };

  return {
    comments: data,
    isLoading,
    error,
    refreshComments,
  };
};
