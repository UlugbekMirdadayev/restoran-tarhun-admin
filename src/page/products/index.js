import React, { useCallback, useEffect, useState } from "react";
import TableComponent from "./table";
import { useCategories, useProducts, useUser } from "../../redux/selectors";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";
import { Button, Flex, Title } from "@mantine/core";
import { setProducts } from "../../redux/productSlice";
import ModalScreen from "../../components/modal";
import FormCreate from "./form";
import { handleDelete } from "../../utils/helpers";
import { PlusIcon, Reload } from "../../components/icon";

const Product = () => {
  const user = useUser();
  const categories = useCategories();
  const products = useProducts();
  const [editForm, setEditForm] = useState({});

  const dispatch = useDispatch();

  const handleOrders = useCallback(
    (update, category_id) => {
      if (!update && products?.length) return;
      dispatch(setLoader(true));
      getRequest(
        `product/get${category_id ? `/${category_id}` : ""}`,
        user?.token
      )
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
    handleOrders();
  }, [handleOrders]);

  return (
    <div className="container-page">
      <Flex justify={"space-between"} align={"center"}>
        <Title>Продукты</Title>
        <Button onClick={() => handleOrders(true)}>
          <Flex align={"center"} gap={10}>
            <Reload fill="#fff" />
            <span>Обновление Данных</span>
          </Flex>
        </Button>
        <ModalScreen
          title={`${
            editForm?.category?.id ? "Обновить" : "Добавление нового продукта"
          }`}
          btn_title={
            <Flex align={"center"} gap={10}>
              <PlusIcon fill="#fff" /> <span>Добавление нового продукта</span>
            </Flex>
          }
          body={({ close, open }) => (
            <FormCreate
              handleOrders={handleOrders}
              close={close}
              open={open}
              editForm={editForm}
              setEditForm={setEditForm}
            />
          )}
          onClose={() => setEditForm({})}
          defaultOpened={!!Object.keys(editForm).length}
        />
      </Flex>
      <TableComponent
        categories={categories}
        data={products}
        handleDelete={(id) =>
          handleDelete(
            `product/delete/${id}`,
            (boolean) => dispatch(setLoader(boolean)),
            handleOrders,
            user?.token
          )
        }
        setEditForm={setEditForm}
      />
    </div>
  );
};

export default Product;
