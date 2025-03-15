import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../user/userSlice";
import { usePost } from "../../../hooks/usePost";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Textarea,
  useNotice,
} from "@yamada-ui/react";
import { PiImageSquare, PiX } from "react-icons/pi";
import { Carousel, CarouselSlide } from "@yamada-ui/carousel";
import { usePostListSWRInfinite } from "../customHooks/usePostListSWRInfinite";
import { useNavigate } from "react-router-dom";

export const PostForm = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const [content, setContent] = useState("");
  const [imageData, setImageData] = useState([]);
  const { handleSubmit } = usePost();
  const notice = useNotice();
  const { refreshPosts } = usePostListSWRInfinite();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.slice(0, 4 - imageData.length);

    setImageData((prevData) => [
      ...prevData,
      ...newFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleRemoveImage = (index) => {
    setImageData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit({ content }, imageData);

      setContent("");
      setImageData([]);
      notice({
        title: "投稿が作成されました",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      await refreshPosts();
    } catch (error) {
      console.error("投稿作成エラー:", error);
      notice({
        title: "投稿作成エラー",
        description: "140文字以内で入力してください",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const isPostValid = content.trim() !== "";

  const handleUserClick = (e) => {
    if (!e.defaultPrevented) {
      e.stopPropagation();
      navigate(`/users/${currentUser.id}`);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Flex width="full" py={3} px={4} borderBottom="1px solid #dcdcde">
        <Box>
          <Avatar
            size="sm"
            src={currentUser?.avatar_url}
            onClick={handleUserClick}
            cursor="pointer"
          />
        </Box>
        <Box width="full" ml={4}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="いまどうしてる？"
            variant="unstyled"
            required
            fontSize="xl"
            mb={4}
            autosize
          />
          {imageData.length > 0 && (
            <Carousel
              slideSize={imageData.length === 1 ? "100%" : "50%"}
              align="start"
              withIndicators={false}
              loop={false}
              draggable={false}
              controlProps={{
                bg: "gray.800",
                color: "white",
                _hover: { bg: "gray.900" },
              }}
            >
              {imageData.map(({ previewUrl }, index) => (
                <CarouselSlide key={index} className="relative">
                  <Box position="relative" w="full" h="full">
                    <Image
                      src={previewUrl}
                      borderRadius="12"
                      objectFit="cover"
                      objectPosition="center"
                      w="full"
                      h="full"
                    />
                    <Button
                      position="absolute"
                      top="1"
                      right="1"
                      bg="gray.800"
                      borderRadius="full"
                      color="white"
                      p={0}
                      size="sm"
                      _hover={{ bg: "gray.900" }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <PiX size="16" />
                    </Button>
                  </Box>
                </CarouselSlide>
              ))}
            </Carousel>
          )}
          <Flex justifyContent="space-between" alignItems="center" pt={2}>
            <Flex>
              <Box mr={2}>
                <PiImageSquare
                  size="24"
                  className="cursor-pointer text-blue-500"
                  onClick={handleIconClick}
                />
              </Box>
            </Flex>
            <Button
              type="submit"
              isDisabled={!isPostValid}
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              borderRadius="full"
              px={4}
            >
              ポストする
            </Button>
          </Flex>
        </Box>
      </Flex>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        disabled={imageData.length >= 4}
      />
    </form>
  );
};
