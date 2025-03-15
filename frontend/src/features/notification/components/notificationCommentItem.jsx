import { Box, Text, Flex, Avatar } from "@yamada-ui/react";
import { Link, useNavigate } from "react-router-dom";

export const NotificationCommentItem = ({ notification }) => {
  const { actor, notifiable } = notification;
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/posts/${notifiable.post.id}`);
  };

  const handleUserClick = (e) => {
    if (!e.defaultPrevented) {
      e.stopPropagation();
      navigate(`/users/${actor.id}`);
    }
  };

  return (
    <Box
      py={2}
      px={4}
      onClick={handlePostClick}
      cursor="pointer"
      position="relative"
    >
      <Text fontSize="sm" color="gray.500" mb={2}>
        <Link
          to={`/posts/${notifiable.post.id}`}
          className="text-blue-500 hover:underline"
        >
          あなたの投稿
        </Link>
        に<span className="font-bold hover:underline">{actor.name}さん</span>
        がコメントしました
      </Text>
      <Flex alignItems="start">
        <Avatar
          size="sm"
          mr={2}
          onClick={handleUserClick}
          cursor="pointer"
          src={actor.avatar_url}
          fallback={<Avatar size="sm" name={actor.name} />}
        />
        <Box w="full">
          <Text>
            <span
              className="font-bold hover:underline"
              onClick={handleUserClick}
              cursor="pointer"
            >
              {actor.name}
            </span>
            <span
              className="text-gray-500 ml-1 text-sm"
              onClick={handleUserClick}
              cursor="pointer"
            >
              @{actor.email?.split("@")[0]}
            </span>
          </Text>
          <Text color="gray.500">{notifiable.content}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
