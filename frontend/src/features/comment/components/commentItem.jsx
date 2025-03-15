import { Box, Text, Flex, Avatar, Tooltip } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";
import { PostImages } from "../../post/components/postImages";
import { CommentMenuButton } from "./commentMenuButton";

export const CommentItem = ({ comment, post, onCommentDeleted }) => {
  const { content, user, created_at, images } = comment;
  const navigate = useNavigate();

  const handleUserClick = (e) => {
    if (!e.defaultPrevented) {
      e.stopPropagation();
      navigate(`/users/${user.id}`);
    }
  };

  return (
    <Box borderBottom="1px solid #dcdcde" py={2} px={4} position="relative">
      <Flex alignItems="start">
        <Avatar
          size="sm"
          mr={2}
          onClick={handleUserClick}
          cursor="pointer"
          src={user.avatar_url}
          fallback={<Avatar size="sm" name={user.name} />}
        />
        <Box w="full">
          <Text>
            <span
              className="font-bold"
              onClick={handleUserClick}
              cursor="pointer"
            >
              {user.name}
            </span>
            <span
              className="text-gray-500 ml-1 text-sm"
              onClick={handleUserClick}
              cursor="pointer"
            >
              @{user.email?.split("@")[0]}
            </span>
            <Tooltip
              label={created_at}
              openDelay={500}
              gutter={2}
              fontSize="xs"
            >
              <span className="text-gray-500 text-sm">・{created_at}</span>
            </Tooltip>
          </Text>
          <Text mb={2}>{content}</Text>
          {images && images.length > 0 && (
            <Box mb={2}>
              <PostImages post={{ images }} />
            </Box>
          )}
        </Box>
      </Flex>
      <CommentMenuButton
        comment={{ ...comment, post_id: post.id }}
        onCommentDeleted={onCommentDeleted}
      />
    </Box>
  );
};
