import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  Tooltip,
  Dialog,
  useDisclosure,
  useNotice,
} from "@yamada-ui/react";
import { PiDotsThreeBold, PiTrash } from "react-icons/pi";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import { useComment } from "../../../hooks/useComment";

export const CommentMenuButton = ({ comment, onCommentDeleted }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notice = useNotice();
  const { handleDelete } = useComment();

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const handleMenuItemClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const onDeleteClick = async () => {
    try {
      onClose();
      await handleDelete(comment.id, comment.post_id);
      if (onCommentDeleted) {
        await onCommentDeleted();
      }
      notice({
        title: "コメントを削除しました",
        status: "success",
      });
    } catch (error) {
      console.error("コメント削除エラー:", error);
      notice({
        title: "コメントの削除に失敗しました",
        description: error.message || "予期せぬエラーが発生しました",
        status: "error",
      });
    }
  };

  return (
    <Box position="absolute" top="0" right="0" onClick={handleClick}>
      <Menu>
        <Tooltip label="もっと見る" openDelay={500} gutter={2} fontSize="xs">
          <MenuButton
            as={IconButton}
            icon={<PiDotsThreeBold w={20} />}
            bg="none"
            border="none"
            w={3}
            p={0.5}
            borderRadius="full"
            color="gray.500"
            _hover={{ bg: "blue.50", color: "blue.500" }}
          />
        </Tooltip>

        <MenuList bg="white" border="none">
          {comment.user.id === currentUser.id ? (
            <MenuItem
              icon={<PiTrash fontSize="1.5em" color="red" />}
              onClick={handleMenuItemClick}
              color="red"
              fontWeight="bold"
            >
              削除
            </MenuItem>
          ) : (
            <MenuItem
              icon={<MdOutlinePersonAddAlt fontSize="1.5em" />}
              fontWeight="bold"
            >
              {comment.user.name}さんをフォロー
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        header="コメントを削除しますか？"
        success={{
          colorScheme: "red",
          children: "削除する",
        }}
        onSuccess={onDeleteClick}
        cancel="キャンセル"
        onCancel={onClose}
      >
        この操作は取り消せません。プロフィール、あなたをフォローしているアカウントのタイムライン、検索結果からコメントが削除されます。
      </Dialog>
    </Box>
  );
};
