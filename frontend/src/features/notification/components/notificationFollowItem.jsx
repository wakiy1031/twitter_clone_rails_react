import { Box, Text, Flex, Avatar } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";

export const NotificationFollowItem = ({ notification }) => {
  const { actor } = notification || {};
  const navigate = useNavigate();

  if (!actor) {
    return null;
  }

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
      onClick={handleUserClick}
      cursor="pointer"
      position="relative"
    >
      <Flex alignItems="start">
        <FaUser size={20} color="rgb(29, 155, 240)" className="mr-2 mt-1" />
        <Box w="full">
          <Avatar
            size="sm"
            mr={2}
            cursor="pointer"
            src={actor.avatar_url}
            fallback={<Avatar size="sm" name={actor.name} />}
          />
          <Text mt={2}>
            <span className="font-bold hover:underline" cursor="pointer">
              {actor.name}
            </span>
            さんにフォローされました
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
