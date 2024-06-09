import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  FileInput,
  Image,
  NumberInput,
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
    label: "Имя",
    as: TextInput,
  },
  {
    name: "body_price",
    label: "Стоимость",
    as: NumberInput,
  },
  {
    name: "sell_price",
    label: "Цена продажи",
    as: NumberInput,
  },
  {
    name: "printer_ip",
    label: "IP-адрес принтера",
    as: TextInput,
  },
  {
    name: "quantity",
    label: "Количество",
    as: NumberInput,
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
      is_infinite: editForm?.is_infinite ? "true" : "false",
      disabled: editForm?.disabled ? "true" : "false",
      quantity: editForm?.quantity || "",
      body_price: editForm?.body_price || "",
      sell_price: editForm?.sell_price || "",
      printer_ip: editForm?.printer_ip || "",
    },
  });

  const onSubmit = (values) => {
    values.is_infinite === "true" && delete values.quantity;
    values.is_infinite = values.is_infinite === "true" ? 1 : 0;
    values.disabled = values.disabled === "true" ? 1 : 0;
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
      if (key === "photo" && !editForm.image_path) return true;
      editForm[key] === values[key] && formData.delete(key);
      return editForm[key] !== values[key] && key !== "photo";
    });

    if (!editedInputs?.length) return toast.info("Никаких изменений !");
    if (editForm?.id) {
      formData.append("printer_ip", editForm.printer_ip);
      formData.append("product_id", editForm.id);
      formData.append("_method", "PUT");

      if (editForm?.image_path || image === null) {
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

    if (image === null) {
      formData.delete("photo");
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
              "Изображение продукта"
            )
          }
          styles={{
            label: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            },
          }}
          description="выберите изображение"
          placeholder="выберите изображение"
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
          <input.as
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
          label="Бесконечный/Ограничено"
          data={[
            {
              value: "true",
              label: "Бесконечный",
              disabled: form.values.is_infinite === "true",
            },
            {
              value: "false",
              label: "Ограничено",
              disabled: form.values.is_infinite === "false",
            },
          ]}
          {...form.getInputProps("is_infinite")}
        />
        <Select
          required
          mt={"md"}
          label="Единица измерения"
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
          label="Категория"
          data={categories.map((item) => ({
            value: String(item?.id),
            label: item?.name,
            disabled: String(item?.id) === String(form.values.category_id),
          }))}
          {...form.getInputProps("category_id")}
        />

        <Select
          required
          mt={"md"}
          label="Отключено"
          data={[
            {
              value: "true",
              label: "Отключено",
              disabled: form.values.disabled === "true",
            },
            {
              value: "false",
              label: "Не отключено",
              disabled: form.values.disabled === "false",
            },
          ]}
          {...form.getInputProps("disabled")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Отправить</Button>
        </Group>
      </form>
    </Box>
  );
}

export default FormCreate;
