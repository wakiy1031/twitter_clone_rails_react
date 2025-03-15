import {
  Button,
  FormControl,
  Avatar,
  Image,
  Flex,
  Box,
  Tooltip,
} from "@yamada-ui/react";
import { FloatingInput } from "../../../components/FloatingInput";
import { useState } from "react";
import { updateUserProfile } from "../../api/userApi";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../userSlice";
import { RiCameraLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

export const UserProfileEditForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: user.name,
    description: user.description,
    website: user.website,
    avatar_image: "",
    header_image: "",
  });
  const [previewUrl, setPreviewUrl] = useState(user.avatar_url);
  const [previewHeaderUrl, setPreviewHeaderUrl] = useState(
    user.header_image_url
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar_image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.onerror = (error) => {
        console.error("プレビュー生成エラー:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        header_image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewHeaderUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveHeaderImage = () => {
    setFormData((prev) => ({
      ...prev,
      header_image: null,
    }));
    setPreviewHeaderUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 現在の画像の状態を確認
      const updateData = {
        ...formData,
        // avatar_imageがnullでない場合のみ、削除フラグを送信
        avatar_image:
          formData.avatar_image === null
            ? null
            : formData.avatar_image || undefined,
        // header_imageがnullでない場合のみ、削除フラグを送信
        header_image:
          formData.header_image === null
            ? null
            : formData.header_image || undefined,
      };

      const updatedUser = await updateUserProfile(updateData);
      dispatch(fetchUser(user.id));
      onSuccess(updatedUser);
    } catch (error) {
      console.error("プロフィール更新中にエラーが発生しました:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <FormControl position="relative">
        {previewHeaderUrl ? (
          <>
            <Image
              src={previewHeaderUrl}
              alt="cover"
              width="100%"
              height="200px"
            />
            <Flex
              align="center"
              gap={2}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleHeaderImageChange}
                style={{ display: "none" }}
                id="header-input"
              />
              <Tooltip
                label="画像を追加"
                openDelay={500}
                gutter={2}
                fontSize="xs"
              >
                <Button
                  as="label"
                  htmlFor="header-input"
                  variant="outline"
                  size="sm"
                  border="none"
                  borderRadius="full"
                  w="44px"
                  h="44px"
                  backdropFilter="blur(4px)"
                  backgroundColor="rgba(15, 20, 25, 0.75)"
                  _hover={{
                    opacity: 0.6,
                  }}
                >
                  <RiCameraLine className="w-6 h-6 text-white" />
                </Button>
              </Tooltip>
              <Tooltip
                label="画像を削除"
                openDelay={500}
                gutter={2}
                fontSize="xs"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveHeaderImage}
                  border="none"
                  borderRadius="full"
                  w="44px"
                  h="44px"
                  backdropFilter="blur(4px)"
                  backgroundColor="rgba(15, 20, 25, 0.75)"
                  _hover={{
                    opacity: 0.6,
                  }}
                >
                  <IoMdClose className="w-6 h-6 text-white" />
                </Button>
              </Tooltip>
            </Flex>
          </>
        ) : (
          <Box
            position="relative"
            width="100%"
            height="200px"
            backgroundColor="gray.200"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleHeaderImageChange}
              style={{ display: "none" }}
              id="header-input"
            />
            <Tooltip
              label="画像を追加"
              openDelay={500}
              gutter={2}
              fontSize="xs"
            >
              <Button
                as="label"
                htmlFor="header-input"
                variant="outline"
                size="sm"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                border="none"
                borderRadius="full"
                w="44px"
                h="44px"
                background="none"
                backdropFilter="blur(4px)"
                backgroundColor="rgba(15, 20, 25, 0.75)"
                _hover={{
                  opacity: 0.6,
                }}
              >
                <RiCameraLine className="w-6 h-6 text-white" />
              </Button>
            </Tooltip>
          </Box>
        )}
      </FormControl>
      <Box mx="4">
        <FormControl position="relative" w="112px" h="112px" mt="-56px" mb="6">
          <Avatar
            src={previewUrl}
            width="100%"
            height="100%"
            position="relative"
            backgroundColor="rgba(0, 0, 0, 0.3)"
            border="3px solid #000"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="avatar-input"
          />
          <Tooltip label="画像を追加" openDelay={500} gutter={2} fontSize="xs">
            <Button
              as="label"
              htmlFor="avatar-input"
              variant="outline"
              size="sm"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              border="none"
              borderRadius="full"
              w="44px"
              h="44px"
              background="none"
              backdropFilter="blur(2px)"
              backgroundColor="rgba(15, 20, 25, 0.75)"
              _hover={{
                opacity: 0.6,
              }}
            >
              <RiCameraLine className="w-6 h-6 text-white" />
            </Button>
          </Tooltip>
        </FormControl>
        <FormControl mb="6">
          <FloatingInput
            id="name"
            name="name"
            type="text"
            placeholder="ユーザーネーム"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb="6">
          <FloatingInput
            id="description"
            name="description"
            type="text"
            placeholder="自己紹介"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb="6">
          <FloatingInput
            id="place"
            name="place"
            type="text"
            placeholder="場所"
            value={formData.place}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FloatingInput
            id="website"
            name="website"
            type="text"
            placeholder="ウェブサイト"
            value={formData.website}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Button
        type="submit"
        colorScheme="white"
        position="absolute"
        top="16px"
        right="16px"
        borderRadius="30px"
        color="gray.900"
        border="1px solid"
        height="30px"
        fontWeight="bold"
        lineHeight="30px"
      >
        保存
      </Button>
    </form>
  );
};
