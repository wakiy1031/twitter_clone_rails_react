import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  useNotice,
} from "@yamada-ui/react";
import { LoginForm } from "./LoginForm";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import { useEffect } from "react";

export const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const notice = useNotice();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accountConfirmationSuccess = searchParams.get(
      "account_confirmation_success"
    );

    if (accountConfirmationSuccess === "true") {
      notice({
        title: "アカウント認証完了",
        description: "アカウントが正常に認証されました。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, notice, navigate]);

  const handleSuccess = () => {
    onClose();
    navigate("/home", { replace: true });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" px={8} py={4}>
      <ModalOverlay />
      <FaXTwitter size="40" className="mx-auto" />
      <ModalHeader>Xにログイン</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <LoginForm onSuccess={handleSuccess} />
        <Text className="mx-auto text-neutral-500">
          アカウントをお持ちでない場合は
          <span className="text-blue-500 ">
            <Link to="/signup">登録</Link>
          </span>
        </Text>
      </ModalBody>
    </Modal>
  );
};
