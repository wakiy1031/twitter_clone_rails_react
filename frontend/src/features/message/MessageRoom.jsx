import { Box, Text, Flex, Avatar } from "@yamada-ui/react";
import { useRecoilValue } from "recoil";
import { selectedRoomIdState } from "./atoms/selectedRoomAtom";
import useSWR from "swr";
import { getRooms } from "../api/roomApi";
import { MessageList } from "./components/MessageList";
import { MessageForm } from "./components/MessageForm";
export const MessageRoom = () => {
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const { data: rooms } = useSWR("rooms", getRooms);

  if (!selectedRoomId) {
    return (
      <Box p={4}>
        <Text color="gray.500">メッセージを選択してください</Text>
      </Box>
    );
  }

  const selectedRoom = rooms?.find((room) => room.id === selectedRoomId);

  if (!selectedRoom) {
    return null;
  }

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      <Flex
        alignItems="center"
        position="sticky"
        top={0}
        left={0}
        pb={4}
        zIndex={3}
        w="100%"
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(5px)"
      >
        <Box>
          <Text fontWeight="bold">{selectedRoom.other_user.name}</Text>
        </Box>
      </Flex>
      <Box flex="1" overflowY="auto" className="scroll-smooth">
        <Box
          textAlign="center"
          mt={6}
          borderBottom="1px solid"
          borderColor="gray.200"
          pb={10}
        >
          <Avatar
            size="lg"
            mr={2}
            src={selectedRoom.other_user.avatar_url}
            fallback={<Avatar size="lg" name={selectedRoom.other_user.name} />}
          />
          <Text fontWeight="bold">{selectedRoom.other_user.name}</Text>
          <Text color="gray.500" fontSize="sm">
            @{selectedRoom.other_user.email?.split("@")[0]}
          </Text>
          <Text mt={2}>{selectedRoom.other_user.description}</Text>
          <Text mt={2}>
            <span className="text-gray-500 text-sm">
              {selectedRoom.other_user.created_at}からTwitterを利用しています
            </span>
            <span className="text-gray-500 text-sm">
              ・{selectedRoom.other_user.followers_count}フォロワー
            </span>
          </Text>
        </Box>

        <Box p={4}>
          <MessageList />
        </Box>
      </Box>
      <MessageForm />
    </Box>
  );
};
