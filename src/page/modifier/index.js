import React, { useCallback, useEffect, useState } from "react";
import TableComponent from "./table";
import { useModifiers, useProducts, useUser } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";
import { Button, Flex, Title } from "@mantine/core";
import ModalScreen from "../../components/modal";
import FormCreate from "./form";
import { handleDelete } from "../../utils/helpers";
import { PlusIcon, Reload } from "../../components/icon";
import { setModifiers } from "../../redux/modifierSlice";
import { setProducts } from "../../redux/productSlice";

const Modifier = () => {
  const user = useUser();
  const modifiers = useModifiers();
  const products = useProducts();
  const [editForm, setEditForm] = useState(null);

  const dispatch = useDispatch();

  const handleGetModifiers = useCallback(
    (update) => {
      if (!update && modifiers?.length) return;
      dispatch(setLoader(true));
      getRequest("product/modifier/get", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setModifiers(data?.result));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(err?.response?.data?.result || "Error");
        });
    },
    [dispatch, modifiers?.length, user?.token]
  );

  const handleProducts = useCallback(
    (update) => {
      if (!update && products?.length) return;
      dispatch(setLoader(true));
      getRequest("product/get", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setProducts(data?.result));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(err?.response?.data?.result || "Error");
        });
    },
    [dispatch, products?.length, user?.token]
  );

  useEffect(() => {
    handleGetModifiers();
    handleProducts();
  }, [handleGetModifiers, handleProducts]);

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
        <Title>Modifikatorlar</Title>
        <Button onClick={() => handleGetModifiers(true)}>
          <Flex align={"center"} gap={10}>
            <Reload fill="#fff" />
            <span>Ma'lumotlarni Yangilash</span>
          </Flex>
        </Button>
        <ModalScreen
          title={`Yangi${editForm?.id ? "lash": " qo'shish"}`}
          btn_title={
            <Flex align={"center"} gap={10}>
              <PlusIcon fill="#fff" /> <span>Yangi qo'shish</span>
            </Flex>
          }
          body={({ close }) => (
            <FormCreate
              handleUpdate={handleGetModifiers}
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
        data={modifiers}
        handleDelete={(id) =>
          handleDelete(
            `product/modifier/delete/${id}`,
            (boolean) => dispatch(setLoader(boolean)),
            handleGetModifiers,
            user?.token
          )
        }
        setEditForm={setEditForm}
      />
    </div>
  );
};

export default Modifier;
