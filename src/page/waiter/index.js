import React, { useCallback, useEffect } from "react";
import TableComponent from "./table";
import { useUser, useWaiter } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";
import { Button, Flex, Title } from "@mantine/core";
import { setWaiters } from "../../redux/waiterSlice";
import { handleDelete } from "../../utils/helpers";
import { Reload } from "../../components/icon";

const Waiter = () => {
  const user = useUser();
  const waiters = useWaiter();

  const dispatch = useDispatch();

  const handleGetWaiters = useCallback(
    (update) => {
      if (!update && waiters?.length) return;
      dispatch(setLoader(true));
      getRequest("user/get", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setWaiters(data?.result?.filter((item) => item?.role !== 1)));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(err?.response?.data?.result || "Error");
        });
    },
    [dispatch, waiters?.length, user?.token]
  );

  useEffect(() => {
    handleGetWaiters();
  }, [handleGetWaiters]);

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
        <Title>Ofitsiantlar</Title>
        <Button onClick={() => handleGetWaiters(true)}>
          <Flex align={"center"} gap={10}>
            <Reload fill="#fff" />
            <span>Ma'lumotlarni Yangilash</span>
          </Flex>
        </Button>
      </Flex>
      <TableComponent
        data={waiters}
        setWaiters={(data) => dispatch(setWaiters(data))}
        setLoader={(boolean) => dispatch(setLoader(boolean))}
        handleDelete={(id) =>
          handleDelete(
            `afitsant/${id}`,
            (boolean) => dispatch(setLoader(boolean)),
            handleGetWaiters,
            user?.token
          )
        }
        handleUpdate={handleGetWaiters}
      />
    </div>
  );
};

export default Waiter;
