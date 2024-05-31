import React from "react";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const ModalScreen = ({
  btn_title,
  title,
  body,
  color,
  onClose,
  defaultOpened,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal
        opened={defaultOpened || opened}
        onClose={() => {
          close();
          typeof onClose === "function" && onClose();
        }}
        title={title}
      >
        {body({ close, open })}
      </Modal>
      <Button bg={color} onClick={open}>
        {btn_title}
      </Button>
    </>
  );
};

export default ModalScreen;
