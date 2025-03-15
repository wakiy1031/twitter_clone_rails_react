import useSWR from "swr";
import { fetchPost } from "../features/api/postApi";

export const usePostDetail = (id) => {
  const { data, error } = useSWR(`/posts/${id}`, () => fetchPost(id));

  return {
    post: data?.data,
    isLoading: !error && !data,
    error: error,
  };
};
