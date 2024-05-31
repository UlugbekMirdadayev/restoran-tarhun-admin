import React, { useCallback, useEffect } from "react";
import TableComponent from "./table";
import { useUser, useAdmins } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";
import { Button, Flex, Title } from "@mantine/core";
import { setAdmins } from "../../redux/adminSlice";
import { handleDelete } from "../../utils/helpers";
import { Reload } from "../../components/icon";

const AdminsPage = () => {
  const user = useUser();
  const admins = useAdmins();

  const dispatch = useDispatch();

  const handleGetAdmins = useCallback(
    (update) => {
      if (!update && admins?.length) return;
      dispatch(setLoader(true));
      getRequest("user/get", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(
            setAdmins(
              data?.result?.filter(
                (item) => item?.role === 1 && user?.id !== item?.id
              )
            )
          );
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(err?.response?.data?.result || "Error");
        });
    },
    [dispatch, admins?.length, user?.token, user?.id]
  );

  useEffect(() => {
    handleGetAdmins();
  }, [handleGetAdmins]);

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
        <Title>Adminlar</Title>
        <Button onClick={() => handleGetAdmins(true)}>
          <Flex align={"center"} gap={10}>
            <Reload fill="#fff" />
            <span>Ma'lumotlarni Yangilash</span>
          </Flex>
        </Button>
      </Flex>
      <TableComponent
        data={admins}
        setWaiters={(data) => dispatch(setAdmins(data))}
        setLoader={(boolean) => dispatch(setLoader(boolean))}
        handleDelete={(id) =>
          handleDelete(
            `afitsant/${id}`,
            (boolean) => dispatch(setLoader(boolean)),
            handleGetAdmins,
            user?.token
          )
        }
        handleUpdate={handleGetAdmins}
      />
    </div>
  );
};

export default AdminsPage;
