import { Box, Loading } from "@yamada-ui/react";
import { useComments } from "../../hooks/useComments";
import { CommentItem } from "./components/commentItem";

export const CommentList = ({ post }) => {
  const { comments, isLoading, error } = useComments(post.id);

  if (isLoading) {
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

  if (error) {
    return <div>コメントの取得中にエラーが発生しました。</div>;
  }

  return (
    <Box>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} post={post} />
      ))}
    </Box>
  );
};
