import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  FileInput,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { postRequest } from "../../services/api";
import { setLoader } from "../../redux/loaderSlice";
import { useCategories, useMeasurements, useUser } from "../../redux/selectors";
import { IMAGE_URL } from "../../utils/constants";

const inputs = [
  {
    name: "name",
    label: "Nomi",
  },
  {
    name: "body_price",
    label: "Tan narxi",
  },
  {
    name: "sell_price",
    label: "Sotilish narxi",
  },
  {
    name: "quantity",
    label: "Dona",
  },
];

function FormCreate({ handleOrders, close, editForm, setEditForm }) {
  const user = useUser();
  const dispatch = useDispatch();
  const [image, setImage] = useState(
    editForm?.image_path ? IMAGE_URL + editForm?.image_path : null
  );
  const categories = useCategories();
  const measurements = useMeasurements();

  const form = useForm({
    initialValues: {
      category_id: String(editForm?.category?.id || categories[0]?.id),
      measurement_id: String(editForm?.measurement?.id || measurements[0]?.id),
      name: editForm?.name || "",
      photo: image,
      is_infinite: String(editForm?.is_infinite || "false"),
      quantity: editForm?.quantity || "",
      body_price: editForm?.body_price || "",
      sell_price: editForm?.sell_price || "",
    },
  });

  const onSubmit = (values) => {
    if (!values.photo) return toast.info("Rasm yuklang !");
    values.is_infinite === "true" && delete values.quantity;
    const formData = new FormData();
    Object.keys(values).map((key) =>
      formData.append(
        key,
        typeof values[key] === "string" ? values[key]?.trim() : values[key]
      )
    );
    const editedInputs = Object.keys(values).filter((key) => {
      if (key === "category_id") {
        String(editForm["category"]?.id) === values[key] &&
          formData.delete("category_id");
        return String(editForm["category"]?.id) !== values[key];
      }
      if (key === "measurement_id") {
        String(editForm["measurement"]?.id) === values[key] &&
          formData.delete("measurement_id");
        return String(editForm["measurement"]?.id) !== values[key];
      }
      if (key === "is_infinite" && editForm.is_infinite === undefined)
        return false;
      if (key === "photo" && !editForm.image_path) return true;
      editForm[key] === values[key] && formData.delete(key);
      return editForm[key] !== values[key] && key !== "photo";
    });

    if (!editedInputs.length)
      return toast.info("O'zgartirishlar kiritilmadi !");
    if (editForm?.id) {
      formData.append("product_id", editForm.id);
      formData.append("_method", "PUT");
      formData.delete("is_infinite");

      if (editForm?.image_path) {
        formData.delete("photo");
      }

      dispatch(setLoader(true));
      postRequest("product/update", formData, user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          toast.success(data?.result);
          handleOrders(true);
          close();
          setEditForm({});
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(JSON.stringify(err?.response?.data));
        });
      return;
    }
    dispatch(setLoader(true));
    postRequest("product/create", formData, user?.token)
      .then(({ data }) => {
        dispatch(setLoader(false));
        toast.success(data?.result);
        handleOrders(true);
        close();
        setEditForm({});
      })
      .catch((err) => {
        dispatch(setLoader(false));
        toast.error(JSON.stringify(err?.response?.data));
      });
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <FileInput
          required
          label={
            image ? (
              <Image
                src={image}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                  flex: 1,
                  margin: " 0 auto",
                }}
              />
            ) : (
              "Rasm"
            )
          }
          styles={{
            label: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            },
          }}
          description="Rasm tanlang"
          placeholder="Rasm tanlang"
          accept="image/*"
          {...form.getInputProps("photo")}
          onChange={(object) => {
            setEditForm({
              ...editForm,
              image_path: null,
            });
            const objectURL = URL.createObjectURL(object);
            setImage(objectURL);
            form.getInputProps("photo").onChange(object);
          }}
        />
        {inputs?.map((input) => (
          <TextInput
            key={input.name}
            mt={"md"}
            required
            withAsterisk
            label={input.label}
            placeholder={input.label}
            onInput={input.typingChange}
            disabled={
              input.name === "quantity" && form.values.is_infinite === "true"
            }
            {...form.getInputProps(input.name)}
          />
        ))}
        <Select
          required
          mt={"md"}
          label="O'lchov birligi"
          data={[
            {
              value: "true",
              label: "Cheksiz",
              disabled: form.values.is_infinite === "true",
            },
            {
              value: "false",
              label: "Chegaralanadi",
              disabled: form.values.is_infinite === "false",
            },
          ]}
          {...form.getInputProps("is_infinite")}
        />
        <Select
          required
          mt={"md"}
          label="O'lchov birligi"
          data={measurements.map((item) => ({
            value: String(item?.id),
            label: item?.name,
            disabled: String(item?.id) === String(form.values.measurement_id),
          }))}
          {...form.getInputProps("measurement_id")}
        />
        <Select
          required
          mt={"md"}
          label="Kategoriya"
          data={categories.map((item) => ({
            value: String(item?.id),
            label: item?.name,
            disabled: String(item?.id) === String(form.values.category_id),
          }))}
          {...form.getInputProps("category_id")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Yuborish</Button>
        </Group>
      </form>
    </Box>
  );
}

export default FormCreate;
