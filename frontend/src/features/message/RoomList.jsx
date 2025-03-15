import { Box, Text, Flex, Avatar, Loading } from "@yamada-ui/react";
import { getRooms } from "../api/roomApi";
import useSWR from "swr";
import { useSetRecoilState } from "recoil";
import { selectedRoomIdState } from "./atoms/selectedRoomAtom";

export const RoomList = () => {
  const { data: rooms, error, isLoading } = useSWR("rooms", getRooms);
  const setSelectedRoomId = useSetRecoilState(selectedRoomIdState);

  if (error) {
    return (
      <Box p={4}>
        <Text>メッセージの取得中にエラーが発生しました。</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Loading
        variant="oval"
        fontSize="2xl"
        color="blue.500"
        mx="auto"
        w="full"
        my={3}
      />
    );
  }

  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId);
  };

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
        <Text fontSize="xl" fontWeight="bold">
          メッセージ
        </Text>
      </Flex>

      {rooms?.length === 0 ? (
        <Box p={4}>
          <Text>メッセージはありません</Text>
        </Box>
      ) : (
        <Box>
          {rooms?.map((room) => (
            <Box
              key={room.id}
              px={4}
              py={2}
              borderBottom="1px solid #dcdcde"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              id="message-room"
              onClick={() => handleRoomClick(room.id)}
            >
              <Flex alignItems="center">
                <Avatar
                  size="sm"
                  mr={2}
                  src={room.other_user.avatar_url}
                  fallback={<Avatar size="md" name={room.other_user.name} />}
                />
                <Box>
                  <Text>
                    <span className="font-bold">{room.other_user.name}</span>
                    <span className="text-gray-500 ml-1 text-xs">
                      @{room.other_user.email?.split("@")[0]}
                    </span>
                    {room.last_message && (
                      <span className="text-gray-500 text-xs">
                        ・{room.last_message.created_at}
                      </span>
                    )}
                  </Text>
                  {room.last_message && (
                    <Text
                      color="gray.500"
                      fontSize="sm"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {room.last_message.content}
                    </Text>
                  )}
                </Box>
              </Flex>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
