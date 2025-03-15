import { Box, Text, Loading, Flex } from "@yamada-ui/react";
import { PostItem } from "../post/components/PostItem";
import useSWR from "swr";
import { getBookmarks } from "../api/bookmarkApi";
import { HistoryNavButton } from "../../components/HistoryNavButton";

export const BookmarkList = () => {
  const {
    data: bookmarks,
    error,
    isLoading,
  } = useSWR("bookmarks", getBookmarks);

  if (error) {
    return <div>ブックマーク一覧の取得中にエラーが発生しました。</div>;
  }

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

  return (
    <Box>
      <Flex
        alignItems="center"
        position="sticky"
        top={0}
        left={0}
        py={2}
        px={3}
        zIndex={3}
        w="100%"
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(5px)"
      >
        <HistoryNavButton />
        <Text ml={4} fontSize="xl" fontWeight="bold">
          ブックマーク
        </Text>
      </Flex>

      {!bookmarks || bookmarks.length === 0 ? (
        <Box p={4}>
          <Text>ブックマークした投稿はありません</Text>
        </Box>
      ) : (
        <Box>
          {bookmarks.map((bookmark) => (
            <PostItem key={bookmark.id} post={bookmark} isBookmarked={true} />
          ))}
        </Box>
      )}
    </Box>
  );
};
