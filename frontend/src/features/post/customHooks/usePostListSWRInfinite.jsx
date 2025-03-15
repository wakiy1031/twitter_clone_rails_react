import useSWRInfinite from "swr/infinite";
import { POSTS_ENDPOINT } from "../../../utils/api";
import axios from "axios";
import { useCallback, useMemo } from "react";

const MAX_NUMBER_OF_ENTRY_BY_QUERY = 50;

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null;
  return `${POSTS_ENDPOINT}?offset=${
    pageIndex * MAX_NUMBER_OF_ENTRY_BY_QUERY
  }&limit=${MAX_NUMBER_OF_ENTRY_BY_QUERY}`;
};

const fetcher = async (url) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return axios.get(url).then((res) => res.data);
};

export const usePostListSWRInfinite = () => {
  const { data, error, isLoading, size, setSize, mutate } = useSWRInfinite(
    getKey,
    fetcher
  );

  const isReachingEnd = useMemo(() => {
    return data && data[data.length - 1]?.length < MAX_NUMBER_OF_ENTRY_BY_QUERY;
  }, [data]);

  const postsDataArr = data || [];

  const loadMorePage = useCallback(() => {
    if (!isReachingEnd) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [isReachingEnd, setSize]);

  const refreshPosts = useCallback(async () => {
    const newData = await fetcher(getKey(0));

    mutate((currentData) => {
      if (!currentData) return [newData];
      return [newData, ...currentData.slice(1)];
    }, false);
  }, [mutate]);

  return {
    postsDataArr,
    error,
    isLoading,
    loadMorePage,
    isReachingEnd,
    size,
    refreshPosts,
  };
};
