import { MessageCircleIcon } from "@yamada-ui/lucide";
import {
  IconButton,
  Modal,
  Tooltip,
  useDisclosure,
  ModalBody,
  Text,
  Flex,
  Box,
  Avatar,
  ModalCloseButton,
} from "@yamada-ui/react";
import { CommentForm } from "../features/comment/components/commentForm";
import useSWR from "swr";
import { fetchPost } from "../features/api/postApi";

const getPostKey = (postId) => `post/${postId}`;

export const CommentButton = ({ post, user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: postData } = useSWR(getPostKey(post.id), () =>
    fetchPost(post.id)
  );

  const commentsCount = postData?.data?.comments_count ?? post.comments_count;

  const handleReplyClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  return (
    <>
      <Tooltip label="返信" openDelay={500} gutter={2} fontSize="xs">
        <Box
          position="relative"
          cursor="pointer"
          _hover={{
            "& > .comment-count": {
              color: "blue.500",
            },
          }}
          onClick={handleReplyClick}
        >
          <IconButton
            variant="ghost"
            icon={<MessageCircleIcon w={20} />}
            aria-label="返信"
            size="sm"
            w={6}
            p={1}
            borderRadius="full"
            color="gray.200"
            _hover={{ bg: "blue.50", color: "blue.500" }}
          />
          <Text
            fontSize="sm"
            color="gray.300"
            className="comment-count"
            position="absolute"
            animation="slideInUp"
            top="50%"
            right="-.25em"
            transform="translateY(-50%)"
          >
            {commentsCount}
          </Text>
        </Box>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onClick={(e) => e.stopPropagation()}
        pt="12"
        size="lg"
      >
        <ModalCloseButton left="var(--ui-spaces-3)" top="var(--ui-spaces-4)" />

        <ModalBody onClick={(e) => e.stopPropagation()} mb={0}>
          <Flex
            alignItems="start"
            className="relative before:content-[''] before:absolute before:w-0.25 before:bg-gray-300 before:h-full before:left-4 before:top-0 pb-3 mb-1"
          >
            <Avatar
              size="sm"
              mr={2}
              cursor="pointer"
              src={user.avatar_url}
              fallback={<Avatar size="sm" name={user.name} />}
            />
            <Box w="full">
              <Text>
                <span className="font-bold" cursor="pointer">
                  {user.name}
                </span>
                <span className="text-gray-500 ml-1 text-sm" cursor="pointer">
                  @{user.email?.split("@")[0]}
                </span>
                <Tooltip
                  label={post.created_at}
                  openDelay={500}
                  gutter={2}
                  fontSize="xs"
                >
                  <span className="text-gray-500 text-sm">
                    ・{post.created_at}
                  </span>
                </Tooltip>
              </Text>
              <Text mb={3}>{post.content}</Text>
              <Text className="text-blue-500">
                <span className="text-gray-500">返信先：</span>@
                {user.email?.split("@")[0]}
                <span className="text-gray-500">さん</span>
              </Text>
            </Box>
          </Flex>
        </ModalBody>

        <ModalBody onClick={(e) => e.stopPropagation()} mt={0}>
          <CommentForm
            post_id={post.id}
            onSuccess={onClose}
            post={post}
            user={user}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
