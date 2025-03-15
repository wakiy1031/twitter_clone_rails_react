import { useEffect, useRef, useCallback } from "react";

import { usePostListSWRInfinite } from "../customHooks/usePostListSWRInfinite";
import { useIsIntersecting } from "../customHooks/useIsIntersecting";
import { Loading } from "@yamada-ui/react";

export const PostLoading = () => {
  const observedRef = useRef(null);
  const { loadMorePage, isReachingEnd } = usePostListSWRInfinite();

  const isIntersection = useIsIntersecting(observedRef);

  const handleLoadMore = useCallback(() => {
    if (!isReachingEnd) {
      loadMorePage();
    }
  }, [isReachingEnd, loadMorePage]);

  useEffect(() => {
    if (isIntersection && !isReachingEnd) {
      handleLoadMore();
    }
  }, [isIntersection, isReachingEnd, handleLoadMore]);

  if (isReachingEnd) return null;

  return (
    <Loading
      ref={observedRef}
      variant="oval"
      fontSize="2xl"
      color="blue.500"
      mx="auto"
      w="full"
      my={3}
    />
  );
};
