import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
} from "@yamada-ui/react";
import { SignUpForm } from "./SignUpForm";
import { FaXTwitter } from "react-icons/fa6";

export const SignUpModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" px={8} py={4}>
      <ModalOverlay />
      <FaXTwitter size="40" className="mx-auto" />
      <ModalHeader>アカウント作成</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <SignUpForm onSuccess={onClose} />
      </ModalBody>
    </Modal>
  );
};
