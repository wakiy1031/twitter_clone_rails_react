import { Button, Tooltip } from "@yamada-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";

export const HistoryNavButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    const isFromModal = location.state?.fromModal;
    const isModal = location.state?.isModal;

    if (isModal) {
      return;
    }

    if (isFromModal) {
      navigate(-2);
      return;
    }
    navigate(-1);
  };

  return (
    <Tooltip label="戻る" openDelay={500} gutter={2} fontSize="xs">
      <Button
        outline="none"
        bg="none"
        borderRadius="full"
        ml={-2.5}
        w={6}
        p={1}
        rightIcon={<BiArrowBack />}
        onClick={goBack}
      ></Button>
    </Tooltip>
  );
};
