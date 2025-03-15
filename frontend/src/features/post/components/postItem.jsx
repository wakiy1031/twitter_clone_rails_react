import { Box, Text, Flex, Avatar, Tooltip } from "@yamada-ui/react";
import { PostImages } from "./postImages";
import { useNavigate } from "react-router-dom";
import { PostMenuButton } from "./postMenuButton";
import { ActionButton } from "../../../components/ActionButton";

export const PostItem = ({ post, onPostDeleted }) => {
  const { id, content, user, created_at, post_create } = post;
  const navigate = useNavigate();

  const handlePostClick = (e) => {
    if (!e.defaultPrevented) {
      navigate(`/${user.name}/${id}`);
    }
  };

  const handleUserClick = (e) => {
    if (!e.defaultPrevented) {
      e.stopPropagation();
      navigate(`/users/${user.id}`);
    }
  };

  return (
    <Box
      borderBottom="1px solid #dcdcde"
      py={2}
      px={4}
      onClick={handlePostClick}
      cursor="pointer"
      position="relative"
    >
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
              label={post_create}
              openDelay={500}
              gutter={2}
              fontSize="xs"
            >
              <span className="text-gray-500 text-sm">・{created_at}</span>
            </Tooltip>
          </Text>
          <Text>{content}</Text>
          <PostImages post={post} />
          <ActionButton post={post} user={user} />
        </Box>
      </Flex>
      <PostMenuButton post={post} onPostDeleted={onPostDeleted} />
    </Box>
  );
};
