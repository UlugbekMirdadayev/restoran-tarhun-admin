import React, { useCallback, useEffect } from "react";
import TableComponent from "./table";
import { useRooms, useUser } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";
import { Button, Flex, Title } from "@mantine/core";
import { setRooms } from "../../redux/roomSlice";
import ModalScreen from "../../components/modal";
import FormCreate from "./form";
import { handleDelete } from "../../utils/helpers";
import { PlusIcon, Reload } from "../../components/icon";

const Room = () => {
  const user = useUser();
  const rooms = useRooms();

  const dispatch = useDispatch();

  const handleGetRooms = useCallback(
    (update) => {
      if (!update && rooms?.length) return;
      dispatch(setLoader(true));
      getRequest("room/get", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setRooms(data?.result));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(err?.response?.data?.result || "Error");
        });
    },
    [dispatch, rooms?.length, user?.token]
  );

  useEffect(() => {
    handleGetRooms();
  }, [handleGetRooms]);


  return (
    <div className="container-page">
      <Flex
        style={{ zIndex: 9 }}
        justify={"space-between"}
        align={"center"}
        pos={"sticky"}
        top={0}
        bg={"#fff"}
      >
        <Title>Xonalar/Stollar</Title>
        <Button onClick={() => handleGetRooms(true)}>
          <Flex align={"center"} gap={10}>
            <Reload fill="#fff" />
            <span>Ma'lumotlarni Yangilash</span>
          </Flex>
        </Button>
        <ModalScreen
          title={"Yangi xona/stol qo'shish"}
          btn_title={
            <Flex align={"center"} gap={10}>
              <PlusIcon fill="#fff" /> <span>Yangi xona/stol qo'shish</span>
            </Flex>
          }
          body={({ close }) => (
            <FormCreate
              handleUpdate={handleGetRooms}
              setLoader={(boolean) => dispatch(setLoader(boolean))}
              close={close}
            />
          )}
        />
      </Flex>
      <TableComponent
        data={rooms}
        user={user}
        handleDelete={(id) =>
          handleDelete(
            `room/delete/${id}`,
            (boolean) => dispatch(setLoader(boolean)),
            handleGetRooms,
            user?.token
          )
        }
      />
    </div>
  );
};

export default Room;
