import {
  VStack,
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Flex,
  Avatar,
  Link,
} from "@yamada-ui/react";
import { PiMagnifyingGlass } from "react-icons/pi";

const TrendItem = ({ category, title, postsCount }) => (
  <Box p={3} _hover={{ bg: "blackAlpha.50" }} cursor="pointer" width="full">
    <Text fontSize="sm" color="gray.500">
      {category}
    </Text>
    <Text fontSize="md" fontWeight="bold">
      {title}
    </Text>
    <Text fontSize="sm" color="gray.500">
      {postsCount}件のポスト
    </Text>
  </Box>
);

const RecommendedUser = ({ avatarUrl, name, username }) => (
  <Flex
    p={3}
    _hover={{ bg: "blackAlpha.50" }}
    cursor="pointer"
    width="full"
    alignItems="center"
    justifyContent="space-between"
  >
    <Flex alignItems="center">
      <Avatar size="sm" src={avatarUrl} />
      <Box ml={2}>
        <Text fontSize="sm" fontWeight="bold">
          {name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          @{username}
        </Text>
      </Box>
    </Flex>
    <Button
      size="sm"
      bg="gray.900"
      color="white"
      _hover={{ bg: "gray.700" }}
      borderRadius="full"
    >
      フォロー
    </Button>
  </Flex>
);

export const RightSidebar = () => {
  return (
    <VStack
      spacing={4}
      position="sticky"
      top={0}
      pt={2}
      height="100dvh"
      alignItems="stretch"
    >
      <Box px={2}>
        <InputGroup>
          <InputLeftElement>
            <Icon as={PiMagnifyingGlass} color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="検索"
            bg="blackAlpha.100"
            border="none"
            borderRadius="full"
            _focus={{
              bg: "white",
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--ui-color-blue-500)",
            }}
          />
        </InputGroup>
      </Box>

      <Box bg="blackAlpha.50" borderRadius="xl" py={2}>
        <Text fontSize="xl" fontWeight="bold" px={4} py={2}>
          プレミアムを今すぐ無料で試す
        </Text>
        <Text px={4} pb={3}>
          プレミアムで表示される広告を減らし、強力なツールを使うことによって、さらに快適に利用しましょう。
        </Text>
        <Box px={4}>
          <Button
            width="full"
            bg="gray.900"
            color="white"
            _hover={{ bg: "gray.800" }}
            borderRadius="full"
          >
            14日間の無料トライアルを開始
          </Button>
        </Box>
      </Box>

      <Box bg="blackAlpha.50" borderRadius="xl">
        <Text fontSize="xl" fontWeight="bold" p={4}>
          「いま」を見つけよう
        </Text>
        <VStack spacing={0} alignItems="stretch">
          <TrendItem
            category="ファッション・ビューティー・トレンド"
            title="マックの福袋"
            postsCount="1,602"
          />
          <TrendItem
            category="食べ物・トレンド"
            title="#これ買っとけ家電2025"
            postsCount="3,306"
          />
          <TrendItem
            category="日本のトレンド"
            title="まさのりさん"
            postsCount="3,020"
          />
        </VStack>
        <Link
          color="blue.500"
          p={4}
          display="block"
          _hover={{ textDecoration: "none" }}
        >
          さらに表示
        </Link>
      </Box>

      <Box bg="blackAlpha.50" borderRadius="xl">
        <Text fontSize="xl" fontWeight="bold" p={4}>
          おすすめユーザー
        </Text>
        <VStack spacing={0} alignItems="stretch">
          <RecommendedUser name="test_01" username="test_01" avatarUrl="" />
          <RecommendedUser name="test_02" username="test_02" avatarUrl="" />
          <RecommendedUser name="test_03" zusername="test_03" avatarUrl="" />
        </VStack>
        <Link
          color="blue.500"
          p={4}
          display="block"
          _hover={{ textDecoration: "none" }}
        >
          さらに表示
        </Link>
      </Box>
    </VStack>
  );
};
