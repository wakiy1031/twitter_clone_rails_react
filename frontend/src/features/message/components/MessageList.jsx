import { Box, Text, Loading } from "@yamada-ui/react";
import { useRecoilValue } from "recoil";
import { selectedRoomIdState } from "../atoms/selectedRoomAtom";
import useSWR from "swr";
import { getMessages } from "../../api/messageApi";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

export const MessageList = () => {
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const currentUser = useSelector((state) => state.user.currentUser);
  const messagesEndRef = useRef(null);
  const {
    data: messages,
    error,
    isLoading,
  } = useSWR(selectedRoomId ? `messages/${selectedRoomId}` : null, () =>
    getMessages(selectedRoomId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  if (!messages || messages.length === 0) {
    return (
      <Box p={4}>
        <Text color="gray.500">メッセージはありません</Text>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      overflowX="clip"
      overflowY="auto"
    >
      {[...messages].reverse().map((message) => {
        const isSelf = message.user.id === currentUser.id;
        return (
          <Box
            key={message.id}
            display="flex"
            justifyContent={isSelf ? "flex-end" : "flex-start"}
            mb={4}
          >
            <Box
              maxW="70%"
              borderRadius="lg"
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: "8px",
                [isSelf ? "right" : "left"]: "-8px",
                borderStyle: "solid",
                borderWidth: "8px",
                borderColor: `transparent ${
                  isSelf ? "#ebf8ff" : "#f7fafc"
                } transparent transparent`,
                transform: isSelf ? "none" : "rotate(180deg)",
              }}
            >
              <Text
                bg={isSelf ? "rgb(29, 155, 240);" : "gray.50"}
                color={isSelf ? "white" : "black"}
                p={2}
                px={3}
                borderRadius="xl"
              >
                {message.content}
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                textAlign={isSelf ? "right" : "left"}
                mt={1}
              >
                {message.created_at}
              </Text>
            </Box>
          </Box>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>
  );
};
