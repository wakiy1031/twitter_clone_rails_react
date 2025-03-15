import { Box, Text, Flex, Avatar } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
export const NotificationFavoriteItem = ({ notification }) => {
  const { actor, notifiable } = notification;
  const navigate = useNavigate();

  const handlePostClick = (e) => {
    if (!e.defaultPrevented) {
      navigate(`/${actor.name}/${notifiable.id}`);
    }
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
      <Flex alignItems="start">
        <FaHeart size={20} className="mr-2 mt-1" color="rgb(249, 24, 128)" />
        <Box w="full">
          <Avatar
            size="sm"
            mr={2}
            onClick={handleUserClick}
            cursor="pointer"
            src={actor.avatar_url}
            fallback={<Avatar size="sm" name={actor.name} />}
          />
          <Text mt={2}>
            <span
              className="font-bold hover:underline"
              onClick={handleUserClick}
              cursor="pointer"
            >
              {actor.name}
            </span>
            さんがあなたのポストをいいねしました
          </Text>
          <Text color="gray.500">{notifiable.content}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
