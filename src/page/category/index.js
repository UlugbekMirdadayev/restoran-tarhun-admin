import React, { useCallback, useEffect, useState } from "react";
import TableComponent from "./table";
import { useCategories, useUser } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";
import { Button, Flex, Title } from "@mantine/core";
import ModalScreen from "../../components/modal";
import FormCreate from "./form";
import { handleDelete } from "../../utils/helpers";
import { PlusIcon, Reload } from "../../components/icon";
import { setCategories } from "../../redux/categoriesSlice";

const Room = () => {
  const user = useUser();
  const categories = useCategories();
  const [editForm, setEditForm] = useState(null);

  const dispatch = useDispatch();

  const handleGetCategories = useCallback(
    (update) => {
      if (!update && categories?.length) return;
      dispatch(setLoader(true));
      getRequest("category/get", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setCategories(data?.result));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(err?.response?.data?.result || "Error");
        });
    },
    [dispatch, categories?.length, user?.token]
  );

  useEffect(() => {
    handleGetCategories();
  }, [handleGetCategories]);

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
        <Button onClick={() => handleGetCategories(true)}>
          <Flex align={"center"} gap={10}>
            <Reload fill="#fff" />
            <span>Ma'lumotlarni Yangilash</span>
          </Flex>
        </Button>
        <ModalScreen
          title={"Yangi kategoriya qo'shish"}
          btn_title={
            <Flex align={"center"} gap={10}>
              <PlusIcon fill="#fff" /> <span>Yangi kategoriya qo'shish</span>
            </Flex>
          }
          body={({ close }) => (
            <FormCreate
              handleUpdate={handleGetCategories}
              setLoader={(boolean) => dispatch(setLoader(boolean))}
              close={() => {
                close();
                setEditForm(null);
              }}
              editForm={editForm}
            />
          )}
          onClose={() => setEditForm(null)}
          defaultOpened={editForm?.id ? true : false}
        />
      </Flex>
      <TableComponent
        data={categories}
        handleDelete={(id) =>
          handleDelete(
            `category/delete/${id}`,
            (boolean) => dispatch(setLoader(boolean)),
            handleGetCategories,
            user?.token
          )
        }
        setEditForm={setEditForm}
      />
    </div>
  );
};

export default Room;
