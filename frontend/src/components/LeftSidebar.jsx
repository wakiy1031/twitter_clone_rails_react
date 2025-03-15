import {
  VStack,
  Button,
  Icon,
  Text,
  Flex,
  Avatar,
  Box,
} from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PiHouse,
  PiMagnifyingGlass,
  PiBell,
  PiEnvelope,
  PiBookmark,
  PiUsers,
  PiUser,
  PiDotsThreeCircle,
} from "react-icons/pi";
import { RiTwitterXFill } from "react-icons/ri";

const SidebarItem = ({ icon, label, onClick, isActive }) => (
  <Button
    variant="ghost"
    justifyContent="flex-start"
    width="full"
    height="50px"
    px={3}
    leftIcon={<Icon as={icon} boxSize="24px" />}
    onClick={onClick}
    borderRadius="full"
    bg={isActive ? "blackAlpha.100" : "transparent"}
    _hover={{ bg: "blackAlpha.50" }}
  >
    <Text fontSize="xl">{label}</Text>
  </Button>
);

export const LeftSidebar = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const menuItems = [
    { icon: PiHouse, label: "ホーム", path: "/home" },
    { icon: PiMagnifyingGlass, label: "話題を検索", path: "/search" },
    { icon: PiBell, label: "通知", path: "/notifications" },
    { icon: PiEnvelope, label: "メッセージ", path: "/rooms" },
    { icon: PiBookmark, label: "ブックマーク", path: "/bookmarks" },
    { icon: PiUsers, label: "コミュニティ", path: "/communities" },
    { icon: PiUser, label: "プロフィール", path: `/users/${currentUser?.id}` },
  ];

  return (
    <VStack
      height="100dvh"
      p={2}
      spacing={1}
      position="sticky"
      top={0}
      alignItems="flex-start"
    >
      <Button
        variant="ghost"
        p={3}
        borderRadius="full"
        _hover={{ bg: "blackAlpha.50" }}
        onClick={() => navigate("/home")}
      >
        <Icon as={RiTwitterXFill} boxSize="28px" />
      </Button>

      {menuItems.map((item) => (
        <SidebarItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          onClick={() => navigate(item.path)}
          isActive={location.pathname === item.path}
        />
      ))}

      <Button
        variant="ghost"
        justifyContent="flex-start"
        width="full"
        height="50px"
        px={3}
        leftIcon={<Icon as={PiDotsThreeCircle} boxSize="24px" />}
        borderRadius="full"
        _hover={{ bg: "blackAlpha.50" }}
      >
        <Text fontSize="xl">もっと見る</Text>
      </Button>

      <Button
        width="90%"
        height="52px"
        bg="blue.500"
        color="white"
        borderRadius="full"
        _hover={{ bg: "blue.600" }}
        mt={2}
      >
        <Text fontSize="lg">ポストする</Text>
      </Button>

      {currentUser && (
        <Flex
          mt="auto"
          p={3}
          width="full"
          alignItems="center"
          borderRadius="full"
          cursor="pointer"
          _hover={{ bg: "blackAlpha.50" }}
          onClick={() => navigate(`/users/${currentUser.id}`)}
        >
          <Avatar
            size="md"
            src={`${currentUser.avatar_url}?${new Date(
              currentUser.updated_at
            ).getTime()}`}
            fallback={<Avatar size="xl" name={currentUser.name} />}
          />
          <Box ml={3}>
            <Text fontWeight="bold" fontSize="sm">
              {currentUser.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              @{currentUser.email?.split("@")[0]}
            </Text>
          </Box>
        </Flex>
      )}
    </VStack>
  );
};
