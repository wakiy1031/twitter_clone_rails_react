import { BookmarkIcon } from "@yamada-ui/lucide";
import { IconButton, Tooltip } from "@yamada-ui/react";
import useSWR from "swr";
import { fetchPost } from "../features/api/postApi";
import { useBookmark } from "../hooks/useBookmark";

const getPostKey = (postId) => `post/${postId}`;

export const BookmarkButton = ({ post }) => {
  const { data: postData } = useSWR(getPostKey(post.id), () =>
    fetchPost(post.id)
  );

  const isBookmarked = postData?.data?.bookmarked ?? post.bookmarked;

  const { handleCreate, handleDelete } = useBookmark();

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    try {
      if (isBookmarked) {
        await handleDelete(post.id);
      } else {
        await handleCreate(post.id);
      }
    } catch (error) {
      console.error("ブックマーク操作に失敗しました。エラーの詳細:", {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data,
        postId: post.id,
        isBookmarked,
      });
    }
  };

  return (
    <Tooltip label="ブックマーク" openDelay={500} gutter={2} fontSize="xs">
      <IconButton
        onClick={handleBookmarkClick}
        variant="ghost"
        icon={<BookmarkIcon w={20} />}
        aria-label="ブックマーク"
        size="sm"
        w={6}
        p={1}
        borderRadius="full"
        color={isBookmarked ? "blue.500" : "gray.200"}
        _hover={{ bg: "blue.50", color: "blue.500" }}
      />
    </Tooltip>
  );
};
