import { PostItem } from "./components/PostItem";
import { Box, Loading } from "@yamada-ui/react";
import { usePostListSWRInfinite } from "./customHooks/usePostListSWRInfinite";
import { PostLoading } from "./components/PostLoding";

export const PostList = () => {
  const { postsDataArr, error, isLoading, isReachingEnd } =
    usePostListSWRInfinite();

  if (error) {
    return <div>投稿一覧の取得中にエラーが発生しました。</div>;
  }

  if (isLoading && postsDataArr.length === 0) {
    return (
      <Loading
        variant="oval"
        fontSize="2xl"
        color="blue.500"
        mx="auto"
        w="full"
        mt={6}
      />
    );
  }

  return (
    <>
      {postsDataArr.map((posts, index) => (
        <Box key={index}>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </Box>
      ))}
      {!isReachingEnd && <PostLoading />}
    </>
  );
};
