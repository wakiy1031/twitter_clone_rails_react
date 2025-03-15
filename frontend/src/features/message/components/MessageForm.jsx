import {
  Box,
  Button,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@yamada-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedRoomIdState } from "../atoms/selectedRoomAtom";
import { api } from "../../../utils/api";
import { mutate } from "swr";
import { BiSend } from "react-icons/bi";

export const MessageForm = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!content.trim() || !selectedRoomId) return;

    setIsLoading(true);
    try {
      await api.post(`/rooms/${selectedRoomId}/messages`, { content });
      setContent("");
      // メッセージリストを更新
      await mutate(`messages/${selectedRoomId}`);
      // ルームリストを更新（最新メッセージを反映するため）
      await mutate("rooms");
    } catch (error) {
      console.error("メッセージの送信に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      position="sticky"
      bottom={0}
      bg="white"
      p={4}
      borderTop="1px solid"
      borderColor="gray.200"
    >
      <InputGroup>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="新しいメッセージを作成"
          pr="4rem"
          bg="gray.100"
          focusBorderColor="transparent"
          autosize
          borderRadius="30px"
        />
        <InputRightElement width="4rem" pointerEvents="auto" zIndex={2}>
          <Button
            onClick={handleSubmit}
            h="1.75rem"
            size="sm"
            colorScheme="none"
            isLoading={isLoading}
            isDisabled={!content.trim() || !selectedRoomId}
            _active={{ bg: "blue.700" }}
          >
            <BiSend className="text-blue-500 text-2xl" />
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};
