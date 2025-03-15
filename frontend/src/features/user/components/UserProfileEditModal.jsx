import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
} from "@yamada-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserProfileEditForm } from "./UserProfileEditForm";

export const UserProfileEditModal = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isOpen = propIsOpen ?? location.state?.isModal;

  const onClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      navigate(-1, {
        replace: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" px="0" py="4">
      <ModalOverlay />
      <ModalHeader pt="0" pl="3em">
        プロフィールを編集
      </ModalHeader>
      <ModalCloseButton left="var(--ui-spaces-3)" top="var(--ui-spaces-4)" />
      <ModalBody px="0">
        <UserProfileEditForm onSuccess={onClose} />
      </ModalBody>
    </Modal>
  );
};
