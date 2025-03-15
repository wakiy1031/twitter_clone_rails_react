import { IconButton, Tooltip } from "@yamada-ui/react";
import { MdOutlineMailOutline } from "react-icons/md";
import { createRoom } from "../../api/roomApi";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { selectedRoomIdState } from "../atoms/selectedRoomAtom";
import { mutate } from "swr";

export const MessageRoomBtn = ({ user }) => {
  const navigate = useNavigate();
  const setSelectedRoomId = useSetRecoilState(selectedRoomIdState);

  const handleCreateRoom = async (e) => {
    e.stopPropagation();
    try {
      const response = await createRoom({ user_id: user.id });
      await mutate("rooms");
      setSelectedRoomId(response.id);
      navigate("/rooms");
    } catch (error) {
      console.error("ルームの作成に失敗しました:", error);
    }
  };

  if (!user?.is_following) {
    return null;
  }

  return (
    <Tooltip label="メッセージ" openDelay={500} gutter={2} fontSize="xs">
      <IconButton
        variant="ghost"
        icon={<MdOutlineMailOutline className="w-6 h-6" />}
        aria-label="メッセージ"
        size="xl"
        w={10}
        h={10}
        p={1}
        position="absolute"
        top="0"
        right="130px"
        borderRadius="full"
        border="1px solid #000"
        onClick={handleCreateRoom}
      />
    </Tooltip>
  );
};
