import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  Tooltip,
  useNotice,
  Dialog,
  useDisclosure,
} from "@yamada-ui/react";
import { PiDotsThreeBold, PiTrash } from "react-icons/pi";
import {
  MdOutlinePersonAddAlt,
  MdOutlinePersonRemoveAlt1,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { deletePost } from "../../api/postApi";
import { usePostListSWRInfinite } from "../customHooks/usePostListSWRInfinite";
import { useFollow } from "../../../hooks/useFollow";
import useSWR, { mutate } from "swr";
import { fetchPost } from "../../api/postApi";

export const PostMenuButton = ({ post, onPostDeleted }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { refreshPosts } = usePostListSWRInfinite();
  const notice = useNotice();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleFollow, handleUnfollow } = useFollow();

  const { data: postData } = useSWR(`post/${post.id}`, () =>
    fetchPost(post.id)
  );

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      await refreshPosts();
      if (onPostDeleted) {
        await onPostDeleted();
      }
      onClose();
      notice({
        title: "投稿を削除しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("投稿の削除に失敗しました:", error);
      notice({
        title: "投稿の削除に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMenuItemClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const handleFollowClick = async (e) => {
    e.stopPropagation();
    try {
      await handleFollow(post.user.id);
      // 投稿データの更新
      await mutate(`post/${post.id}`);
      // 投稿一覧の更新
      await refreshPosts();
      // 同じユーザーの他の投稿も更新
      await mutate((key) => typeof key === "string" && key.startsWith("post/"));
    } catch (error) {
      console.error("フォローに失敗しました:", error);
    }
  };

  const handleUnfollowClick = async (e) => {
    e.stopPropagation();
    try {
      await handleUnfollow(post.user.id);
      // 投稿データの更新
      await mutate(`post/${post.id}`);
      // 投稿一覧の更新
      await refreshPosts();
      // 同じユーザーの他の投稿も更新
      await mutate((key) => typeof key === "string" && key.startsWith("post/"));
    } catch (error) {
      console.error("フォロー解除に失敗しました:", error);
    }
  };

  const isFollowing =
    postData?.data?.user?.is_following ?? post.user.is_following;

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
          {post.user_id === currentUser.id ? (
            <MenuItem
              icon={<PiTrash fontSize="1.5em" color="red" />}
              onClick={handleMenuItemClick}
              color="red"
              fontWeight="bold"
            >
              削除
            </MenuItem>
          ) : isFollowing ? (
            <MenuItem
              icon={
                <MdOutlinePersonRemoveAlt1
                  fontSize="1.5em"
                  className="text-red-500"
                />
              }
              fontWeight="bold"
              onClick={handleUnfollowClick}
              color="red.500"
            >
              {post.user.name}さんをフォロー解除
            </MenuItem>
          ) : (
            <MenuItem
              icon={<MdOutlinePersonAddAlt fontSize="1.5em" />}
              fontWeight="bold"
              onClick={handleFollowClick}
            >
              {post.user.name}さんをフォロー
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        header="ポストを削除しますか？"
        success={{
          colorScheme: "red",
          children: "削除する",
        }}
        onSuccess={handleDelete}
        cancel="キャンセル"
        onCancel={onClose}
      >
        この操作は取り消せません。プロフィール、あなたをフォローしているアカウントのタイムライン、検索結果からポストが削除されます。
      </Dialog>
    </Box>
  );
};
