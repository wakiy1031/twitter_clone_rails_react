import {
  Button,
  VStack,
  Text,
  HStack,
  useDisclosure,
  Box,
  Flex,
} from "@yamada-ui/react";
import { FaApple, FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { SignUpModal } from "../features/auth/components/SignUpModal";
import { LoginModal } from "../features/auth/components/LoginModal";
import { useLocation, useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { onClose: onSignUpClose } = useDisclosure();
  const { onClose: onLoginClose } = useDisclosure();

  const handleCloseSignUp = () => {
    onSignUpClose();
    navigate("/", { replace: true });
  };

  const handleCloseLogin = () => {
    onLoginClose();
    navigate("/", { replace: true });
  };

  const showSignUpModal = location.pathname === "/signup";
  const showLoginModal = location.pathname === "/login";

  return (
    <Box minH="100vh" bg="white">
      <Flex
        h="100vh"
        className="lg:items-center lg:justify-center lg:py-16 py-4 px-4 lg:p-0"
        direction={{ base: "row", lg: "column" }}
      >
        <Box w={{ base: "50%", lg: "100%" }}>
          <Box w={{ base: "380px", lg: "55px" }} className="lg:mx-auto">
            <FaXTwitter className="w-full h-full" />
          </Box>
        </Box>
        <Box
          w={{ base: "50%", lg: "100%" }}
          spacing={6}
          align="stretch"
          className="lg:p-8 p-0 lg:mt-0 mt-6"
        >
          <Text
            fontSize={{ base: "6xl", lg: "5xl" }}
            fontWeight="bold"
            lineHeight="1.2"
            mb={6}
          >
            すべての話題が、
            <br className="lg:hidden" />
            ここに。
          </Text>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            今すぐ参加しましょう。
          </Text>
          <VStack
            spacing={6}
            align="stretch"
            w={{ base: "75%", lg: "100%" }}
            py={1}
            maxW={{ base: "300px", lg: "100%" }}
          >
            <Button
              leftIcon={<FcGoogle />}
              variant="outline"
              onClick={() => console.log("Google sign up")}
            >
              Googleで登録
            </Button>
            <Button
              leftIcon={<FaApple />}
              variant="outline"
              onClick={() => console.log("Apple sign up")}
            >
              Appleのアカウントで登録
            </Button>

            <HStack>
              <Box flex={1} h="1px" bg="gray.300" />
              <Text px={2}>または</Text>
              <Box flex={1} h="1px" bg="gray.300" />
            </HStack>

            <Button
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              onClick={() => navigate("/signup")}
            >
              アカウントを作成
            </Button>

            <Text fontSize="xs" color="gray.500">
              アカウントを登録することにより、利用規約とプライバシーポリシー（Cookieの使用を含む）に同意したとみなされます。
            </Text>

            <Box mt={8}>
              <Text fontWeight="bold" mb={2}>
                アカウントをお持ちの場合
              </Text>
              <Button
                variant="outline"
                w="full"
                onClick={() => navigate("/login")}
              >
                ログイン
              </Button>
            </Box>
          </VStack>
        </Box>
      </Flex>

      {showSignUpModal && (
        <SignUpModal isOpen={true} onClose={handleCloseSignUp} />
      )}
      {showLoginModal && (
        <LoginModal isOpen={true} onClose={handleCloseLogin} />
      )}
    </Box>
  );
};
